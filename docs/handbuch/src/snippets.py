# -*- coding: utf-8 -*-
"""Luau-Beispiele fuer das Handbuch. Werden beim Build per StyLua auf Syntax geprueft."""

NEW_ACTION = '''
-- 1) Config.luau: Zahlen auslagern
Config.PLOT_COUNT = 6
Config.WATER_COOLDOWN = 3 -- Sekunden
Config.WATER_REWARD = 5
-- und in DEFAULT_DATA ein neues Feld:  waterCount = 0

-- 2) Neue Datei Services/PlantService.luau (ModuleScript)
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Config = require(ReplicatedStorage:WaitForChild("Config"))
local DataService = require(script.Parent.DataService)
local EconomyService = require(script.Parent.EconomyService)

local PlantService = {}
local lastAction = {} -- [Player] = Zeitpunkt der letzten Aktion

function PlantService.start(remotes)
	remotes.Water.OnServerEvent:Connect(function(player, plotId)
		-- a) Eingaben prüfen: nie dem Client vertrauen
		if type(plotId) ~= "number" or plotId % 1 ~= 0 or plotId < 1 or plotId > Config.PLOT_COUNT then
			return
		end
		local data = DataService.get(player)
		if not data then
			return
		end
		-- b) Abklingzeit auf dem Server erzwingen
		local now = os.clock()
		if now - (lastAction[player] or -1000) < Config.WATER_COOLDOWN then
			return
		end
		lastAction[player] = now
		-- c) Zustand ändern + belohnen (alles serverseitig)
		data.waterCount += 1
		EconomyService.addCoins(player, Config.WATER_REWARD, "water")
	end)
end

return PlantService

-- 3) In Main.server.luau: "Water" zur Remote-Liste hinzufügen und PlantService.start(remotes) aufrufen
-- 4) Client: button.Activated:Connect(function() remotes.Water:FireServer(1) end)
'''

PRODUCT_BUTTON = '''
-- Client.client.luau: Knopf für das Developer Product "500 Münzen"
local productButton = makeButton("Buy500", "500 MÜNZEN", UDim2.fromScale(0.5, 0.28), UDim2.fromScale(0.3, 0.08), Color3.fromRGB(147, 51, 234))
productButton.Activated:Connect(function()
	local id = Config.PRODUCTS.Coins500.id
	if id ~= 0 then
		MarketplaceService:PromptProductPurchase(player, id)
	else
		showNotice("Trage zuerst die Produkt-ID in Config ein.")
	end
end)
'''

AB_TEST = '''
-- Einfacher A/B-Test: Spieler dauerhaft einer Gruppe zuordnen (gleiche UserId = gleiche Gruppe)
local function variantOf(player, testName)
	local hash = (player.UserId + #testName * 7919) % 2
	return if hash == 0 then "A" else "B"
end

-- Beispiel: Startgeschenk testen (A = 50 Münzen, B = 100 Münzen)
DataService.onLoaded(function(player, data)
	if data.totalCollected == 0 then
		local variant = variantOf(player, "startgift")
		EconomyService.addCoins(player, if variant == "A" then 50 else 100, "startgift_" .. variant)
		Analytics.custom(player, "startgift_" .. variant, 1)
	end
end)
-- Danach: D1/D7 der beiden Gruppen im Dashboard vergleichen. Immer nur EINE Änderung pro Test.
'''

FRIEND_BONUS = '''
-- Freunde-Bonus: +10 % pro Freund im selben Server (max. +50 %)
local Players = game:GetService("Players")
local friendCache = {} -- [Player] = { [UserId] = true/false }

local function isFriend(player, other)
	friendCache[player] = friendCache[player] or {}
	local cached = friendCache[player][other.UserId]
	if cached ~= nil then
		return cached
	end
	local ok, result = pcall(function()
		return player:IsFriendsWith(other.UserId) -- Web-Aufruf: Ergebnis zwischenspeichern!
	end)
	friendCache[player][other.UserId] = ok and result == true
	return friendCache[player][other.UserId]
end

local function friendMultiplier(player)
	local count = 0
	for _, other in Players:GetPlayers() do
		if other ~= player and isFriend(player, other) then
			count += 1
		end
	end
	return 1 + math.min(count, 5) * 0.1
end
'''

ALL = {"NEW_ACTION": NEW_ACTION, "PRODUCT_BUTTON": PRODUCT_BUTTON, "AB_TEST": AB_TEST, "FRIEND_BONUS": FRIEND_BONUS}
