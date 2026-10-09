-- Main (Script) -> ServerScriptService
-- Startet alles in der richtigen Reihenfolge und legt die RemoteEvents an.

local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Services = script.Parent:WaitForChild("Services")
local DataService = require(Services:WaitForChild("DataService"))
local EconomyService = require(Services:WaitForChild("EconomyService"))
local ShopService = require(Services:WaitForChild("ShopService"))
local DailyRewards = require(Services:WaitForChild("DailyRewards"))
local BetaGate = require(Services:WaitForChild("BetaGate"))

-- RemoteEvents anlegen (der Client wartet mit WaitForChild darauf)
local remotes = Instance.new("Folder")
remotes.Name = "Remotes"
for _, name in { "Collect", "BuyUpgrade", "ClaimDaily", "RequestState", "State", "Notice" } do
	local remote = Instance.new("RemoteEvent")
	remote.Name = name
	remote.Parent = remotes
end
remotes.Parent = ReplicatedStorage

-- Verdrahten
DataService.onLoaded(EconomyService.setupPlayer)
EconomyService.setMultiplierProvider(function(player)
	return if ShopService.ownsPass(player, "DoubleCoins") then 2 else 1
end)

BetaGate.start() -- zuerst: Unbefugte fliegen raus, bevor Daten geladen werden
DataService.start()
EconomyService.start(remotes)
DailyRewards.start(remotes)
ShopService.start(function(player)
	EconomyService.pushState(player) -- zeigt den neuen Multiplikator sofort an
end)

print("[Main] Server gestartet.")
