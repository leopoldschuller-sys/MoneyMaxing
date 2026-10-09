-- DataService (ModuleScript) -> ServerScriptService/Services
-- Lädt und speichert Spielerdaten sicher:
--   * Sitzungssperre (verhindert, dass zwei Server gleichzeitig am selben Spieler schreiben)
--   * Wiederholungen bei DataStore-Fehlern, Auto-Save, Speichern beim Verlassen/Shutdown
--   * Studio-Testmodus ohne Speichern, falls der API-Zugriff nicht aktiviert ist

local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")

local Config = require(ReplicatedStorage:WaitForChild("Config"))

local DataService = {}

local store = DataStoreService:GetDataStore(Config.DATASTORE_NAME)
local JOB_ID = if game.JobId ~= "" then game.JobId else "studio"

local sessions = {} -- [Player] = Session
local releasing = {} -- [key] = true, solange ein Spieler gerade gespeichert/freigegeben wird
local loadedCallbacks = {}
local started = false

local function deepCopy(value)
	if type(value) ~= "table" then
		return value
	end
	local copy = {}
	for k, v in value do
		copy[k] = deepCopy(v)
	end
	return copy
end

local function reconcile(data, template)
	for key, defaultValue in template do
		if data[key] == nil then
			data[key] = deepCopy(defaultValue)
		end
	end
	return data
end

local function lockedByOther(record)
	local lock = if type(record) == "table" then record.lock else nil
	return lock ~= nil
		and lock.job ~= JOB_ID
		and os.time() - lock.time < Config.LOCK_TIMEOUT_SECONDS
end

local function withRetries(label, attempts, fn)
	local lastError
	for attempt = 1, attempts do
		local ok, result = pcall(fn)
		if ok then
			return true, result
		end
		lastError = result
		warn(
			string.format(
				"[DataService] %s fehlgeschlagen (Versuch %d/%d): %s",
				label,
				attempt,
				attempts,
				tostring(result)
			)
		)
		if attempt < attempts then
			task.wait(math.min(2 ^ attempt, 8))
		end
	end
	return false, lastError
end

-- Holt die Daten und setzt gleichzeitig unsere Sperre.
local function acquire(key)
	local blocked = false
	local loadedData = nil
	local ok = withRetries("Laden", 3, function()
		store:UpdateAsync(key, function(record)
			blocked = false
			loadedData = nil
			if type(record) ~= "table" then
				record = {}
			end
			if lockedByOther(record) then
				blocked = true
				return nil -- abbrechen, nichts schreiben
			end
			loadedData = record.data
			record.lock = { job = JOB_ID, time = os.time() }
			return record
		end)
	end)
	return ok, blocked, loadedData
end

local function writeSession(session, release)
	local lost = false
	local ok = withRetries("Speichern", 4, function()
		store:UpdateAsync(session.key, function(record)
			lost = false
			if lockedByOther(record) then
				lost = true -- ein anderer Server hat übernommen: NICHT überschreiben
				return nil
			end
			return {
				data = session.data,
				lock = if release then nil else { job = JOB_ID, time = os.time() },
			}
		end)
	end)
	if lost then
		warn("[DataService] Sitzungssperre verloren, nicht gespeichert: " .. session.key)
	end
	return ok and not lost
end

local function saveSession(session, release)
	if session.readOnly then
		return true
	end
	while session.saving do
		task.wait(0.05)
	end
	session.saving = true
	session.dirty = false -- Änderungen während des Speicherns setzen es wieder auf true
	local ok = writeSession(session, release)
	if not ok then
		session.dirty = true
	end
	session.saving = false
	return ok
end

local function endSession(player)
	local session = sessions[player]
	if not session or session.ending then
		return
	end
	session.ending = true
	releasing[session.key] = true
	saveSession(session, true)
	releasing[session.key] = nil
	sessions[player] = nil
end

local function openSession(player, key, loaded, readOnly)
	local data = reconcile(loaded or {}, Config.DEFAULT_DATA)
	data.version = Config.DEFAULT_DATA.version -- hier später Migrationen einbauen
	local session = {
		player = player,
		key = key,
		data = data,
		dirty = true,
		saving = false,
		ending = false,
		readOnly = readOnly == true,
	}
	sessions[player] = session
	for _, callback in loadedCallbacks do
		task.spawn(callback, player, data)
	end
end

local function onPlayerAdded(player)
	local key = "Player_" .. player.UserId
	while releasing[key] do
		task.wait(0.1) -- alte Sitzung dieses Spielers wird noch gespeichert
	end

	local ok, blocked, loaded
	for _ = 1, 5 do
		ok, blocked, loaded = acquire(key)
		if not ok or not blocked then
			break
		end
		task.wait(3) -- anderer Server speichert noch, kurz warten
		if player.Parent ~= Players then
			return
		end
	end

	if player.Parent ~= Players then
		if ok and not blocked then -- Sperre, die wir gerade gesetzt haben, wieder lösen
			writeSession({ key = key, data = reconcile(loaded or {}, Config.DEFAULT_DATA) }, true)
		end
		return
	end

	if ok and not blocked then
		openSession(player, key, loaded, false)
	elseif RunService:IsStudio() then
		warn(
			"[DataService] Kein DataStore-Zugriff. Testmodus OHNE Speichern. "
				.. "(Game Settings > Security > Enable Studio Access to API Services)"
		)
		openSession(player, key, nil, true)
	elseif blocked then
		player:Kick(
			"Deine Daten werden noch gespeichert. Bitte versuche es in einer Minute erneut."
		)
	else
		player:Kick("Deine Daten konnten nicht geladen werden. Bitte versuche es später erneut.")
	end
end

local function autosaveLoop()
	while true do
		task.wait(Config.AUTOSAVE_SECONDS)
		local pending = {}
		for _, session in sessions do
			if session.dirty and not session.ending then
				table.insert(pending, session)
			end
		end
		for _, session in pending do
			task.spawn(saveSession, session, false)
			task.wait(0.2) -- Anfragen entzerren
		end
	end
end

-- Öffentliche API ---------------------------------------------------------------

function DataService.start()
	if started then
		return
	end
	started = true
	Players.PlayerAdded:Connect(onPlayerAdded)
	for _, player in Players:GetPlayers() do
		task.spawn(onPlayerAdded, player)
	end
	Players.PlayerRemoving:Connect(endSession)
	task.spawn(autosaveLoop)
	game:BindToClose(function()
		for player in sessions do
			task.spawn(endSession, player)
		end
		while next(sessions) ~= nil or next(releasing) ~= nil do
			task.wait(0.1)
		end
	end)
end

function DataService.onLoaded(callback)
	table.insert(loadedCallbacks, callback)
end

function DataService.get(player)
	local session = sessions[player]
	return if session then session.data else nil
end

function DataService.isLoaded(player)
	return sessions[player] ~= nil
end

function DataService.markDirty(player)
	local session = sessions[player]
	if session then
		session.dirty = true
	end
end

function DataService.saveNow(player)
	local session = sessions[player]
	if not session then
		return false
	end
	return saveSession(session, false)
end

return DataService
