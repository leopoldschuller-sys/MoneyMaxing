-- DailyRewards (ModuleScript) -> ServerScriptService/Services
-- Tägliche Belohnung mit Serie (Streak). Ein verpasster Tag wird verziehen (Config.DAILY_GRACE_DAYS).
-- Tageswechsel = 00:00 UTC (in Deutschland 01:00 bzw. 02:00 Uhr).

local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Config = require(ReplicatedStorage:WaitForChild("Config"))
local DataService = require(script.Parent.DataService)
local EconomyService = require(script.Parent.EconomyService)
local Analytics = require(script.Parent.Analytics)

local DailyRewards = {}

local remotes = nil
local claiming = {} -- verhindert Doppelklicks, während gespeichert wird

-- Gibt (ok, belohnung, serie) zurück
function DailyRewards.claim(player)
	local data = DataService.get(player)
	if not data then
		return false
	end
	local today = Config.currentDay()
	if data.lastDailyDay == today then
		return false
	end
	local gap = today - data.lastDailyDay
	local streak
	if data.lastDailyDay ~= 0 and gap <= 1 + Config.DAILY_GRACE_DAYS then
		streak = data.dailyStreak + 1
	else
		streak = 1
	end
	local rewards = Config.DAILY_REWARDS
	local reward = rewards[(streak - 1) % #rewards + 1]

	data.lastDailyDay = today -- zuerst eintragen, dann belohnen (kein Doppel-Claim möglich)
	data.dailyStreak = streak
	EconomyService.addCoins(player, reward, "daily")
	EconomyService.reachStep(player, data, 4, "FirstDaily")
	Analytics.custom(player, "daily_claimed", streak)
	return true, reward, streak
end

function DailyRewards.start(remoteFolder)
	remotes = remoteFolder
	remotes.ClaimDaily.OnServerEvent:Connect(function(player)
		if claiming[player] then
			return
		end
		claiming[player] = true
		local ok, reward, streak = DailyRewards.claim(player)
		if ok then
			remotes.Notice:FireClient(player, string.format("Tag %d: +%d Münzen!", streak, reward))
			DataService.saveNow(player)
		else
			remotes.Notice:FireClient(player, "Heute schon abgeholt. Komm morgen wieder!")
		end
		claiming[player] = nil
	end)
end

return DailyRewards
