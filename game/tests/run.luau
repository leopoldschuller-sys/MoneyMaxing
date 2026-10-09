-- Server-Logik-Test: läuft in einer ECHTEN Luau-VM, Roblox-Dienste sind nachgebaut (Mocks).
-- Aufruf (aus game/): luau_runner tests/run.luau   (siehe tests/README.md)
-- Getestet wird NUR die Server-Logik (Daten, Wirtschaft, Käufe, Tägliches). Kein UI, keine Physik.

local ROOT = "src/"
local passed, failed, threadErrors = 0, 0, 0
local warnings = {}

local function check(cond, msg)
	if cond then
		passed += 1
	else
		failed += 1
		print("  FAIL: " .. msg)
	end
end

local function section(name)
	print("== " .. name)
end

-- Virtuelle Zeit + Scheduler ---------------------------------------------------
local now = 0
local BASE_TIME = 1800000000 + 12 * 3600 -- mittags UTC, damit Tageswechsel eindeutig sind
local sleepers = {}

local function resume(co, ...)
	local ok, err = coroutine.resume(co, ...)
	if not ok then
		threadErrors += 1
		print("  THREAD ERROR: " .. tostring(err))
	end
end

task = {
	spawn = function(fn, ...)
		local co = coroutine.create(fn)
		resume(co, ...)
		return co
	end,
	wait = function(t)
		t = t or 0.03
		table.insert(sleepers, { co = coroutine.running(), wake = now + t })
		coroutine.yield()
		return t
	end,
	delay = function(t, fn, ...)
		local args = { ... }
		task.spawn(function()
			task.wait(t)
			fn(table.unpack(args))
		end)
	end,
}

local function advance(dt)
	local target = now + dt
	while true do
		local bestIndex, best
		for i, s in sleepers do
			if s.wake <= target and (best == nil or s.wake < best.wake) then
				best, bestIndex = s, i
			end
		end
		if not best then
			break
		end
		table.remove(sleepers, bestIndex)
		now = math.max(now, best.wake)
		resume(best.co)
	end
	now = target
end

os.time = function()
	return BASE_TIME + math.floor(now)
end
os.clock = function()
	return now
end
warn = function(...)
	local parts = {}
	for _, v in { ... } do
		table.insert(parts, tostring(v))
	end
	table.insert(warnings, table.concat(parts, " "))
end

-- Hilfen ----------------------------------------------------------------------
local function deepCopy(v)
	if type(v) ~= "table" then
		return v
	end
	local c = {}
	for k, x in v do
		c[k] = deepCopy(x)
	end
	return c
end

local function newSignal()
	local sig = { handlers = {} }
	function sig:Connect(fn)
		table.insert(self.handlers, fn)
		return { Disconnect = function() end }
	end
	function sig:Fire(...)
		for _, h in self.handlers do
			task.spawn(h, ...)
		end
	end
	return sig
end

-- Instance-Mock ------------------------------------------------------------------
local fired = {} -- alle FireClient-Aufrufe: { remote, player, args }

local function newInstance(className)
	local data = { ClassName = className, Name = className }
	local children = {}
	local inst
	local methods = {}
	function methods.FindFirstChild(_, name)
		for _, c in children do
			if c.Name == name then
				return c
			end
		end
		return nil
	end
	function methods.WaitForChild(self, name)
		local c = methods.FindFirstChild(self, name)
		assert(c, "WaitForChild: " .. name .. " existiert nicht (Test-Aufbau)")
		return c
	end
	function methods._addChild(_, c)
		table.insert(children, c)
	end
	function methods._removeChild(_, c)
		for i, x in children do
			if x == c then
				table.remove(children, i)
				return
			end
		end
	end
	function methods.GetChildren()
		local copy = {}
		for i, c in children do
			copy[i] = c
		end
		return copy
	end
	function methods.GetRankInGroup(_, groupId)
		return if data.groupRanks then (data.groupRanks[groupId] or 0) else 0
	end
	function methods.Kick(_, msg)
		data.kicked = msg or ""
	end
	function methods.FireClient(_, player, ...)
		table.insert(fired, { remote = data.Name, player = player, args = { ... } })
	end
	if className == "RemoteEvent" then
		data.OnServerEvent = newSignal()
		data.OnClientEvent = newSignal()
	end
	inst = setmetatable({}, {
		__index = function(_, k)
			if methods[k] then
				return methods[k]
			end
			if data[k] ~= nil then
				return data[k]
			end
			return methods.FindFirstChild(nil, k) -- inst.KindName wie in Roblox
		end,
		__newindex = function(_, k, v)
			if k == "Parent" then
				if data.Parent and data.Parent._removeChild then
					data.Parent:_removeChild(inst)
				end
				data.Parent = v
				if v and v._addChild then
					v:_addChild(inst)
				end
			else
				data[k] = v
			end
		end,
	})
	return inst
end

Instance = {
	new = function(className)
		return newInstance(className)
	end,
}

Enum = {
	ProductPurchaseDecision = {
		PurchaseGranted = "PurchaseGranted",
		NotProcessedYet = "NotProcessedYet",
	},
	AnalyticsEconomyFlowType = { Source = "Source", Sink = "Sink" },
}

-- Modul-Lader (wie require() auf ModuleScripts) ------------------------------------
local moduleCache = {}
function require(inst)
	if moduleCache[inst] ~= nil then
		return moduleCache[inst]
	end
	local fn = __load(inst._path)
	local previous = script
	script = inst
	local result = fn()
	script = previous
	moduleCache[inst] = result
	return result
end

-- Gemeinsames Backend (alle Server teilen sich einen DataStore) ----------------------
local db = {}
local dbFailures = 0
local dbWrites = 0
local LATENCY = 0.3

local function newDataStore()
	return {
		UpdateAsync = function(_, key, transform)
			task.wait(LATENCY)
			if dbFailures > 0 then
				dbFailures -= 1
				error("502: simulierter DataStore-Fehler")
			end
			local old = deepCopy(db[key])
			local new = transform(old)
			if new == nil then
				return old
			end
			dbWrites += 1
			db[key] = deepCopy(new)
			return deepCopy(new)
		end,
	}
end

local ownedPasses = {}
local analyticsLog = {}

-- Server hochfahren -----------------------------------------------------------------
local function bootServer(jobId, opts)
	opts = opts or {}
	local server = { jobId = jobId, closers = {} }
	local Players = newInstance("Players")
	Players.PlayerAdded = newSignal()
	Players.PlayerRemoving = newSignal()
	function Players.GetPlayers()
		return Players:GetChildren()
	end
	function Players.GetPlayerByUserId(_, userId)
		for _, p in Players:GetChildren() do
			if p.UserId == userId then
				return p
			end
		end
		return nil
	end
	local ReplicatedStorage = newInstance("ReplicatedStorage")
	local ServerScriptService = newInstance("ServerScriptService")
	local Marketplace = newInstance("MarketplaceService")
	Marketplace.PromptGamePassPurchaseFinished = newSignal()
	function Marketplace.UserOwnsGamePassAsync(_, userId, passId)
		return ownedPasses[userId .. ":" .. passId] == true
	end
	local services = {
		Players = Players,
		ReplicatedStorage = ReplicatedStorage,
		ServerScriptService = ServerScriptService,
		MarketplaceService = Marketplace,
		DataStoreService = { GetDataStore = newDataStore },
		RunService = {
			IsStudio = function()
				return opts.studio == true
			end,
		},
		AnalyticsService = setmetatable({}, {
			__index = function(_, name)
				return function(_, ...)
					table.insert(analyticsLog, { name = name, args = { ... } })
				end
			end,
		}),
	}
	server.game = {
		JobId = if opts.studio then "" else jobId,
		GetService = function(_, name)
			return assert(services[name], "Service fehlt im Mock: " .. name)
		end,
		BindToClose = function(_, fn)
			table.insert(server.closers, fn)
		end,
	}
	server.Players, server.Marketplace, server.ReplicatedStorage =
		Players, Marketplace, ReplicatedStorage

	-- Baum wie im Studio
	local function module(name, path, parent)
		local m = newInstance("ModuleScript")
		m.Name, m._path = name, ROOT .. path
		m.Parent = parent
		return m
	end
	module("Config", "shared/Config.luau", ReplicatedStorage)
	local Services = newInstance("Folder")
	Services.Name = "Services"
	Services.Parent = ServerScriptService
	for _, n in
		{ "Analytics", "BetaGate", "DailyRewards", "DataService", "EconomyService", "ShopService" }
	do
		module(n, "server/Services/" .. n .. ".luau", Services)
	end
	local main = newInstance("Script")
	main.Name = "Main"
	main.Parent = ServerScriptService

	-- Main.server.luau mit diesem Server als `game` ausführen
	game = server.game
	script = main
	moduleCache = {} -- jeder Server bekommt eigene Modul-Instanzen (eigene JOB_ID, eigener Zustand)
	if opts.beforeMain then
		opts.beforeMain(require(ReplicatedStorage:WaitForChild("Config")))
	end
	local chunk = __load(ROOT .. "server/Main.server.luau")
	chunk()
	server.Config = require(ReplicatedStorage:WaitForChild("Config"))
	server.remotes = ReplicatedStorage:WaitForChild("Remotes")
	server.Economy = require(Services:WaitForChild("EconomyService"))
	server.Daily = require(Services:WaitForChild("DailyRewards"))
	server.Data = require(Services:WaitForChild("DataService"))
	server.Shop = require(Services:WaitForChild("ShopService"))
	-- Modul-Tabellen für spätere Aufrufe sichern (moduleCache wird beim nächsten Server geleert)
	return server
end

local function join(server, userId)
	local p = newInstance("Player")
	p.Name, p.UserId = "Spieler" .. userId, userId
	p.Parent = server.Players
	server.Players.PlayerAdded:Fire(p)
	return p
end

local function leave(server, p)
	server.Players.PlayerRemoving:Fire(p)
	p.Parent = nil
end

local function lastState(p)
	for i = #fired, 1, -1 do
		if fired[i].remote == "State" and fired[i].player == p then
			return fired[i].args[1]
		end
	end
	return nil
end

local function notices(p)
	local out = {}
	for _, f in fired do
		if f.remote == "Notice" and f.player == p then
			table.insert(out, f.args[1])
		end
	end
	return out
end

local function clearLog()
	fired = {}
	analyticsLog = {}
	warnings = {}
end

local function fireRemote(server, name, p, ...)
	server.remotes:WaitForChild(name).OnServerEvent:Fire(p, ...)
end

local function resetWorld()
	db, dbFailures, dbWrites, ownedPasses = {}, 0, 0, {}
	clearLog()
end

-- ===================================================================================
-- TESTS
-- ===================================================================================

section("1. Beitritt, Ladevorgang, leaderstats")
resetWorld()
local A = bootServer("serverA")
local p1 = join(A, 1001)
advance(1)
check(A.Data.isLoaded(p1), "Spieler ist geladen")
check(
	p1:FindFirstChild("leaderstats")
		and p1:FindFirstChild("leaderstats"):FindFirstChild("Coins") ~= nil,
	"leaderstats/Coins existiert"
)
check(lastState(p1) and lastState(p1).coins == 0, "Startzustand an Client gesendet")
check(
	db["Player_1001"] and db["Player_1001"].lock and db["Player_1001"].lock.job == "serverA",
	"Sitzungssperre gesetzt"
)

section("2. Sammeln + Rate-Limit")
for _ = 1, 40 do
	fireRemote(A, "Collect", p1)
end
advance(0.01)
check(
	A.Data.get(p1).coins == 12,
	"Burst auf 12 begrenzt (war " .. tostring(A.Data.get(p1).coins) .. ")"
)
advance(1)
for _ = 1, 40 do
	fireRemote(A, "Collect", p1)
end
advance(0.01)
check(
	A.Data.get(p1).coins == 24,
	"nach 1 s wieder 12 erlaubt (war " .. tostring(A.Data.get(p1).coins) .. ")"
)
check(p1.leaderstats.Coins.Value == 24, "leaderstats folgt dem Zustand")

section("3. Upgrades")
check(
	A.Config.upgradeCost(0) == 10
		and A.Config.upgradeCost(1) == 11
		and A.Config.upgradeCost(10) == 40,
	"Preisformel"
)
check(A.Config.collectAmount(0) == 1 and A.Config.collectAmount(3) == 4, "Ertragsformel")
local before = A.Data.get(p1).coins
fireRemote(A, "BuyUpgrade", p1)
advance(0.01)
check(
	A.Data.get(p1).upgradeLevel == 1 and A.Data.get(p1).coins == before - 10,
	"Upgrade gekauft, 10 Münzen abgezogen"
)
local function findLog(name, pred)
	for _, e in analyticsLog do
		if e.name == name and pred(e.args) then
			return true
		end
	end
	return false
end
check(
	findLog("LogEconomyEvent", function(a)
		return a[2] == "Sink"
			and a[3] == "Coins"
			and a[5] == 10
			and a[6] == "Gameplay"
			and a[7] == "upgrade"
	end),
	"Analytics: Economy-Event (Sink, upgrade) korrekt"
)
check(findLog("LogOnboardingFunnelStepEvent", function(a)
	return a[2] == 1
end) and findLog("LogOnboardingFunnelStepEvent", function(a)
	return a[2] == 2
end) and findLog("LogOnboardingFunnelStepEvent", function(a)
	return a[2] == 3
end), "Analytics: Onboarding-Schritte 1-3")
advance(1)
fireRemote(A, "BuyUpgrade", p1) -- Level 1 kostet 11, wir haben 14 -> ok
advance(0.01)
check(
	A.Data.get(p1).upgradeLevel == 2 and A.Data.get(p1).coins == before - 21,
	"zweites Upgrade (11 Münzen)"
)
advance(1)
for _ = 1, 10 do
	fireRemote(A, "BuyUpgrade", p1) -- zu wenig Münzen / Spam
end
advance(0.01)
check(A.Data.get(p1).coins >= 0, "Münzen nie negativ")
check(#notices(p1) >= 1, "Hinweis 'Nicht genug Münzen' gesendet")

section("4. Manipulationsversuche am Server-API")
local coinsNow = A.Data.get(p1).coins
check(A.Economy.addCoins(p1, -5, "x") == false, "negative Beträge abgelehnt")
check(A.Economy.addCoins(p1, 0 / 0, "x") == false, "NaN abgelehnt")
check(A.Economy.addCoins(p1, "100", "x") == false, "Text statt Zahl abgelehnt")
check(A.Data.get(p1).coins == coinsNow, "Münzen unverändert")

section("5. Speichern beim Verlassen + Wiederbeitritt")
local coinsBeforeLeave = A.Data.get(p1).coins
local levelBeforeLeave = A.Data.get(p1).upgradeLevel
leave(A, p1)
advance(2)
check(db["Player_1001"].data.coins == coinsBeforeLeave, "Münzen gespeichert")
check(db["Player_1001"].data.upgradeLevel == levelBeforeLeave, "Level gespeichert")
check(db["Player_1001"].lock == nil, "Sperre beim Verlassen freigegeben")
local p1b = join(A, 1001)
advance(1)
check(
	A.Data.get(p1b) and A.Data.get(p1b).coins == coinsBeforeLeave,
	"Wiederbeitritt lädt gespeicherte Münzen"
)

section("6. Auto-Save")
fireRemote(A, "Collect", p1b)
advance(0.01)
local expected = A.Data.get(p1b).coins
advance(70)
check(db["Player_1001"].data.coins == expected, "Auto-Save hat geschrieben")

section("7. Server-Hopping: anderer Server hält noch die Sperre")
-- p1b ist noch auf A. Spieler tritt gleichzeitig Server B bei.
local B = bootServer("serverB")
game = B.game
local p1onB = join(B, 1001)
advance(4) -- B wartet (blockiert), A hält die Sperre
check(not B.Data.isLoaded(p1onB), "B lädt NICHT, solange A die Sperre hält")
leave(A, p1b) -- A gibt frei
advance(10)
check(B.Data.isLoaded(p1onB), "B lädt nach Freigabe durch A")
check(B.Data.get(p1onB) and B.Data.get(p1onB).coins == expected, "B sieht den letzten Stand von A")
leave(B, p1onB)
advance(3)

section("8. Sperre bleibt hängen (Server-Absturz) bzw. ist frisch")
resetWorld()
local C = bootServer("serverC")
db["Player_2002"] =
	{ data = { coins = 77, version = 1 }, lock = { job = "toterServer", time = os.time() - 500 } }
local p2 = join(C, 2002)
advance(2)
check(C.Data.isLoaded(p2) and C.Data.get(p2).coins == 77, "abgelaufene Sperre wird übernommen")
db["Player_2003"] =
	{ data = { coins = 5, version = 1 }, lock = { job = "lebenderServer", time = os.time() } }
local p3 = join(C, 2003)
advance(25)
check(not C.Data.isLoaded(p3), "frische fremde Sperre wird respektiert")
check(
	p3.kicked ~= nil and string.find(p3.kicked, "gespeichert") ~= nil,
	"Spieler bekommt verständliche Kick-Nachricht"
)
check(db["Player_2003"].data.coins == 5, "fremde Daten unangetastet")

section("9. DataStore-Fehler")
resetWorld()
local D = bootServer("serverD")
dbFailures = 2
local p4 = join(D, 3003)
advance(15)
check(D.Data.isLoaded(p4), "Laden gelingt nach 2 Fehlversuchen (Wiederholung)")
leave(D, p4)
advance(3)
dbFailures = 99
local p5 = join(D, 3004)
advance(30)
check(not D.Data.isLoaded(p5), "Dauerhafter Fehler: kein Spielstart mit leeren Daten")
check(p5.kicked ~= nil and string.find(p5.kicked, "geladen") ~= nil, "Kick mit Hinweistext")
dbFailures = 0

section("10. Studio-Testmodus ohne API-Zugriff")
resetWorld()
local S = bootServer("studio", { studio = true })
dbFailures = 99
local ps = join(S, 4004)
advance(30)
check(S.Data.isLoaded(ps), "Studio: Spiel startet trotz Fehler")
check(ps.kicked == nil, "Studio: kein Kick")
fireRemote(S, "Collect", ps)
advance(0.01)
check(S.Data.get(ps).coins == 1, "Studio: Spielen funktioniert")
local writesBefore = dbWrites
leave(S, ps)
advance(5)
check(dbWrites == writesBefore, "Studio-Testmodus schreibt nie in den DataStore")
dbFailures = 0

section("11. Käufe (ProcessReceipt) und Game Pass")
resetWorld()
local E = bootServer("serverE")
E.Config.PRODUCTS.Coins500.id = 555
E.Config.GAME_PASSES.DoubleCoins = 777
ownedPasses["5005:777"] = true
local pe = join(E, 5005)
advance(2)
check(lastState(pe).multiplier == 2, "Game Pass erkannt: Multiplikator 2")
fireRemote(E, "Collect", pe)
advance(0.01)
check(E.Data.get(pe).coins == 2, "Sammeln mit Pass gibt doppelt")
local base = E.Data.get(pe).coins
local receipt = { PlayerId = 5005, PurchaseId = "abc-1", ProductId = 555 }
local decision
task.spawn(function()
	decision = game:GetService("MarketplaceService").ProcessReceipt(receipt)
end)
advance(3)
check(decision == "PurchaseGranted", "Kauf bestätigt")
check(E.Data.get(pe).coins == base + 500, "500 Münzen gutgeschrieben")
check(
	findLog("LogEconomyEvent", function(a)
		return a[2] == "Source" and a[6] == "IAP" and a[7] == "purchase:Coins500"
	end),
	"Analytics: Kauf als IAP-Quelle geloggt"
)
task.spawn(function()
	decision = game:GetService("MarketplaceService").ProcessReceipt(receipt)
end)
advance(3)
check(
	decision == "PurchaseGranted" and E.Data.get(pe).coins == base + 500,
	"Wiederholter Beleg: KEINE doppelte Belohnung"
)
check(db["Player_5005"].data.purchases[1] == "abc-1", "Kauf-ID im DataStore gespeichert")
task.spawn(function()
	decision = game:GetService("MarketplaceService")
		.ProcessReceipt({ PlayerId = 5005, PurchaseId = "zzz", ProductId = 999 })
end)
advance(3)
check(decision == "NotProcessedYet", "Unbekanntes Produkt: nicht bestätigt")
task.spawn(function()
	decision = game:GetService("MarketplaceService")
		.ProcessReceipt({ PlayerId = 9999, PurchaseId = "q", ProductId = 555 })
end)
advance(3)
check(decision == "NotProcessedYet", "Spieler nicht im Spiel: nicht bestätigt")
-- Speichern schlägt beim Kauf fehl -> NICHT bestätigen, später ohne Doppelbelohnung nachholen
local receipt2 = { PlayerId = 5005, PurchaseId = "abc-2", ProductId = 555 }
dbFailures = 99
task.spawn(function()
	decision = game:GetService("MarketplaceService").ProcessReceipt(receipt2)
end)
advance(40)
check(decision == "NotProcessedYet", "Speichern fehlgeschlagen: Kauf nicht bestätigt")
local afterFirstTry = E.Data.get(pe).coins
dbFailures = 0
task.spawn(function()
	decision = game:GetService("MarketplaceService").ProcessReceipt(receipt2)
end)
advance(5)
check(decision == "PurchaseGranted", "Zweiter Versuch bestätigt")
check(E.Data.get(pe).coins == afterFirstTry, "Zweiter Versuch belohnt nicht noch einmal")

section("12. Game Pass während des Spiels kaufen")
local pf = join(E, 6006)
advance(2)
check(lastState(pf).multiplier == 1, "Ohne Pass Multiplikator 1")
E.Marketplace.PromptGamePassPurchaseFinished:Fire(pf, 777, true)
advance(0.5)
check(lastState(pf).multiplier == 2, "Nach Kauf sofort Multiplikator 2")

section("13. Tägliche Belohnung")
resetWorld()
local F = bootServer("serverF")
local pg = join(F, 7007)
advance(2)
check(lastState(pg).dailyReady == true, "Belohnung bereit")
fireRemote(F, "ClaimDaily", pg)
advance(2)
check(F.Data.get(pg).coins == 50 and F.Data.get(pg).dailyStreak == 1, "Tag 1: 50 Münzen")
fireRemote(F, "ClaimDaily", pg)
advance(2)
check(F.Data.get(pg).coins == 50, "Zweimal am selben Tag: keine zweite Belohnung")
advance(86400)
fireRemote(F, "ClaimDaily", pg)
advance(2)
check(F.Data.get(pg).dailyStreak == 2 and F.Data.get(pg).coins == 125, "Tag 2: Serie 2, +75")
advance(86400 * 2) -- ein Tag verpasst -> Gnade
fireRemote(F, "ClaimDaily", pg)
advance(2)
check(F.Data.get(pg).dailyStreak == 3, "Ein verpasster Tag wird verziehen")
advance(86400 * 3) -- zwei Tage verpasst -> Serie startet neu
fireRemote(F, "ClaimDaily", pg)
advance(2)
check(F.Data.get(pg).dailyStreak == 1, "Zwei verpasste Tage: Serie beginnt neu")
for _ = 1, 7 do
	advance(86400)
	fireRemote(F, "ClaimDaily", pg)
	advance(2)
end
check(F.Data.get(pg).dailyStreak == 8, "Serie läuft weiter (8)")
check(
	F.Config.DAILY_REWARDS[(8 - 1) % #F.Config.DAILY_REWARDS + 1] == 50,
	"Belohnungsliste beginnt nach 7 Tagen von vorn"
)

section("14. Sperre verloren: nicht überschreiben")
resetWorld()
local G = bootServer("serverG")
local ph = join(G, 8008)
advance(2)
fireRemote(G, "Collect", ph)
advance(0.01)
db["Player_8008"].lock = { job = "serverX", time = os.time() } -- jemand anderes hat übernommen
db["Player_8008"].data = { coins = 9999 }
advance(70) -- Auto-Save von G
check(db["Player_8008"].data.coins == 9999, "G überschreibt fremde Daten nicht")
check(#warnings > 0, "Warnung wegen verlorener Sperre")

section("15. Spieler verlässt während des Ladens")
resetWorld()
local H = bootServer("serverH")
local pj = newInstance("Player")
pj.Name, pj.UserId = "Schnellweg", 9009
pj.Parent = H.Players
H.Players.PlayerAdded:Fire(pj)
advance(0.1)
pj.Parent = nil
H.Players.PlayerRemoving:Fire(pj)
advance(5)
check(not H.Data.isLoaded(pj), "keine Sitzung für abwesenden Spieler")
check(db["Player_9009"] == nil or db["Player_9009"].lock == nil, "Sperre wieder freigegeben")

section("16. Server-Shutdown (BindToClose)")
resetWorld()
local I = bootServer("serverI")
local pk1, pk2 = join(I, 1111), join(I, 2222)
advance(2)
fireRemote(I, "Collect", pk1)
fireRemote(I, "Collect", pk2)
advance(0.01)
local finished = false
task.spawn(function()
	for _, closer in I.closers do
		closer()
	end
	finished = true
end)
advance(10)
check(finished, "BindToClose endet (hängt nicht)")
check(
	db["Player_1111"].data.coins == 1 and db["Player_2222"].data.coins == 1,
	"Beide Spieler gespeichert"
)
check(db["Player_1111"].lock == nil and db["Player_2222"].lock == nil, "Beide Sperren freigegeben")

section("17. Closed Beta (BetaGate)")
resetWorld()
-- BETA_ONLY wird beim Start gelesen: Config vor Main setzen, indem wir den Server mit vorbereiteter Config booten
local Z = bootServer("serverZ", {
	beforeMain = function(config)
		config.BETA_ONLY = true
		config.BETA_ALLOWLIST[111] = true
		config.BETA_GROUP_ID = 42
		config.BETA_MIN_RANK = 5
	end,
})
local tOk = join(Z, 111)
local tGroup = newInstance("Player")
tGroup.Name, tGroup.UserId, tGroup.groupRanks = "Gruppenmitglied", 222, { [42] = 10 }
tGroup.Parent = Z.Players
Z.Players.PlayerAdded:Fire(tGroup)
local tLow = newInstance("Player")
tLow.Name, tLow.UserId, tLow.groupRanks = "NiedrigerRang", 333, { [42] = 1 }
tLow.Parent = Z.Players
Z.Players.PlayerAdded:Fire(tLow)
local tNone = join(Z, 444)
advance(3)
check(tOk.kicked == nil, "Allowlist-Tester darf rein")
check(tGroup.kicked == nil, "Gruppenmitglied mit ausreichendem Rang darf rein")
check(tLow.kicked ~= nil, "Gruppenrang zu niedrig: Kick")
check(tNone.kicked ~= nil and string.find(tNone.kicked, "Beta") ~= nil, "Fremder: Kick mit Hinweis")

-- Ergebnis ---------------------------------------------------------------------------
print(
	string.format(
		"\n%d Prüfungen bestanden, %d fehlgeschlagen, %d Thread-Fehler",
		passed,
		failed,
		threadErrors
	)
)
if failed > 0 or threadErrors > 0 then
	error("TESTS FEHLGESCHLAGEN")
end
print("ALLE TESTS GRÜN")
