-- BetaGate (ModuleScript) -> ServerScriptService/Services
-- Lässt in der Closed Beta nur eingeladene Tester spielen. Aus für den Launch: Config.BETA_ONLY = false.

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Config = require(ReplicatedStorage:WaitForChild("Config"))

local BetaGate = {}

local function isAllowed(player): boolean
	if Config.BETA_ALLOWLIST[player.UserId] then
		return true
	end
	if Config.BETA_GROUP_ID ~= 0 then
		local ok, rank = pcall(function()
			return player:GetRankInGroup(Config.BETA_GROUP_ID)
		end)
		if ok and rank >= Config.BETA_MIN_RANK then
			return true
		end
	end
	return false
end

local function check(player)
	if not isAllowed(player) then
		player:Kick("Diese Beta ist nur für eingeladene Tester. Bis zum Launch!")
	end
end

function BetaGate.start()
	if not Config.BETA_ONLY then
		return
	end
	Players.PlayerAdded:Connect(check)
	for _, player in Players:GetPlayers() do
		task.spawn(check, player)
	end
end

return BetaGate
