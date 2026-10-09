-- EconomyService (ModuleScript) -> ServerScriptService/Services
-- Die Wahrheit über Münzen und Upgrades liegt IMMER hier auf dem Server.
-- Der Client darf nur bitten ("ich habe geklickt"), nie sagen "gib mir 1000 Münzen".

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Config = require(ReplicatedStorage:WaitForChild("Config"))
local DataService = require(script.Parent.DataService)
local Analytics = require(script.Parent.Analytics)

local EconomyService = {}

local remotes = nil
local multiplierProvider = function(_player)
	return 1
end
local buckets = {} -- [Player] = { [aktion] = { tokens, last } }

-- Rate-Limit (Token-Bucket): erlaubt `perSecond` Aktionen pro Sekunde, Burst bis `burst`
local function allow(player, action: string, perSecond: number, burst: number): boolean
	local playerBuckets = buckets[player]
	if not playerBuckets then
		playerBuckets = {}
		buckets[player] = playerBuckets
	end
	local now = os.clock()
	local bucket = playerBuckets[action]
	if not bucket then
		bucket = { tokens = burst, last = now }
		playerBuckets[action] = bucket
	end
	bucket.tokens = math.min(burst, bucket.tokens + (now - bucket.last) * perSecond)
	bucket.last = now
	if bucket.tokens >= 1 then
		bucket.tokens -= 1
		return true
	end
	return false
end

local function reachStep(player, data, step: number, name: string)
	if data.onboardingStep < step then
		data.onboardingStep = step
		Analytics.step(player, step, name)
	end
end

local function notice(player, text: string)
	if remotes then
		remotes.Notice:FireClient(player, text)
	end
end

function EconomyService.setMultiplierProvider(fn)
	multiplierProvider = fn
end

function EconomyService.getState(player)
	local data = DataService.get(player)
	if not data then
		return nil
	end
	local multiplier = multiplierProvider(player)
	return {
		coins = data.coins,
		level = data.upgradeLevel,
		perClick = Config.collectAmount(data.upgradeLevel) * multiplier,
		nextCost = if data.upgradeLevel >= Config.MAX_UPGRADE_LEVEL
			then nil
			else Config.upgradeCost(data.upgradeLevel),
		multiplier = multiplier,
		dailyReady = data.lastDailyDay ~= Config.currentDay(),
		streak = data.dailyStreak,
	}
end

function EconomyService.pushState(player)
	local state = EconomyService.getState(player)
	if not state or not remotes then
		return
	end
	local stats = player:FindFirstChild("leaderstats")
	local coinsValue = if stats then stats:FindFirstChild("Coins") else nil
	if coinsValue then
		coinsValue.Value = math.floor(state.coins)
	end
	remotes.State:FireClient(player, state)
end

-- Nur für Server-Code (Belohnungen, Käufe). Gibt true zurück, wenn gutgeschrieben.
function EconomyService.addCoins(player, amount: number, reason: string): boolean
	local data = DataService.get(player)
	if not data or type(amount) ~= "number" or amount ~= amount or amount <= 0 then
		return false
	end
	data.coins += amount
	data.totalCollected += amount
	DataService.markDirty(player)
	Analytics.economy(player, true, "Coins", data.coins, amount, reason)
	EconomyService.pushState(player)
	return true
end

function EconomyService.setupPlayer(player, _data)
	local stats = Instance.new("Folder")
	stats.Name = "leaderstats"
	local coins = Instance.new("IntValue")
	coins.Name = "Coins"
	coins.Value = 0
	coins.Parent = stats
	stats.Parent = player
	local data = DataService.get(player)
	if data then
		reachStep(player, data, 1, "Joined")
	end
	EconomyService.pushState(player)
end

local function onCollect(player)
	local data = DataService.get(player)
	if not data then
		return
	end
	if
		not allow(player, "Collect", Config.MAX_COLLECTS_PER_SECOND, Config.MAX_COLLECTS_PER_SECOND)
	then
		return
	end
	local amount = Config.collectAmount(data.upgradeLevel) * multiplierProvider(player)
	data.coins += amount
	data.totalCollected += amount
	DataService.markDirty(player)
	reachStep(player, data, 2, "FirstCollect")
	EconomyService.pushState(player)
end

local function onBuyUpgrade(player)
	local data = DataService.get(player)
	if not data then
		return
	end
	if not allow(player, "BuyUpgrade", 4, 4) then
		return
	end
	if data.upgradeLevel >= Config.MAX_UPGRADE_LEVEL then
		notice(player, "Maximales Level erreicht!")
		return
	end
	local cost = Config.upgradeCost(data.upgradeLevel)
	if data.coins < cost then
		notice(player, "Nicht genug Münzen!")
		return
	end
	data.coins -= cost
	data.upgradeLevel += 1
	DataService.markDirty(player)
	Analytics.economy(player, false, "Coins", data.coins, cost, "upgrade")
	reachStep(player, data, 3, "FirstUpgrade")
	EconomyService.pushState(player)
end

function EconomyService.start(remoteFolder)
	remotes = remoteFolder
	remotes.Collect.OnServerEvent:Connect(onCollect)
	remotes.BuyUpgrade.OnServerEvent:Connect(onBuyUpgrade)
	remotes.RequestState.OnServerEvent:Connect(function(player)
		if allow(player, "RequestState", 2, 3) then
			EconomyService.pushState(player)
		end
	end)
	Players.PlayerRemoving:Connect(function(player)
		buckets[player] = nil
	end)
end

EconomyService.reachStep = reachStep

return EconomyService
