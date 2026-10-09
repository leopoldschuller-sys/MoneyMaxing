-- Config (ModuleScript) -> ReplicatedStorage
-- Alle Zahlen, Namen und IDs an EINEM Ort. Hier drehst du später am Balancing.

local Config = {}

-- Datenspeicher -------------------------------------------------------------
Config.DATASTORE_NAME = "PlayerData_v1"
Config.AUTOSAVE_SECONDS = 60
Config.LOCK_TIMEOUT_SECONDS = 120 -- so lange gilt eine Sitzungssperre höchstens

-- Standardwerte für neue Spieler (Feld hinzufügen = hier eintragen) -----------
Config.DEFAULT_DATA = {
	version = 1,
	coins = 0,
	totalCollected = 0,
	upgradeLevel = 0,
	lastDailyDay = 0,
	dailyStreak = 0,
	onboardingStep = 0,
	purchases = {}, -- zuletzt verarbeitete Kauf-IDs (Schutz vor Doppel-Belohnung)
}

-- Ökonomie (Platzhalter-Loop: Klicken -> Münzen -> Upgrade) -------------------
Config.COLLECT_BASE = 1 -- Münzen pro Klick auf Level 0
Config.COLLECT_PER_LEVEL = 1 -- zusätzliche Münzen pro Upgrade-Level
Config.UPGRADE_BASE_COST = 10 -- Preis für Level 1
Config.UPGRADE_GROWTH = 1.15 -- Preis wächst pro Level um 15 %
Config.MAX_UPGRADE_LEVEL = 100
Config.MAX_COLLECTS_PER_SECOND = 12 -- Server-Limit gegen Auto-Clicker
Config.DAILY_REWARDS = { 50, 75, 100, 150, 200, 300, 500 } -- 7-Tage-Serie
Config.DAILY_GRACE_DAYS = 1 -- so viele verpasste Tage verzeihen wir

-- Monetarisierung: IDs aus dem Creator Hub eintragen (0 = noch nicht gesetzt) ---
Config.GAME_PASSES = {
	DoubleCoins = 0,
}
Config.PRODUCTS = {
	Coins500 = { id = 0, coins = 500 },
}

-- Closed Beta: nur eingeladene Tester dürfen rein (BETA_ONLY = true) ----------
Config.BETA_ONLY = false
Config.BETA_ALLOWLIST = {
	-- [123456789] = true, -- UserId deines Testers (Profil-URL: roblox.com/users/ZAHL)
}
Config.BETA_GROUP_ID = 0 -- optional: alle Mitglieder dieser Gruppe dürfen rein
Config.BETA_MIN_RANK = 1 -- ab diesem Gruppenrang (1 = jedes Mitglied)

-- Gemeinsame Rechenfunktionen (Client zeigt Preise an, Server prüft sie) -------
function Config.upgradeCost(level: number): number
	return math.floor(Config.UPGRADE_BASE_COST * Config.UPGRADE_GROWTH ^ level)
end

function Config.collectAmount(level: number): number
	return Config.COLLECT_BASE + Config.COLLECT_PER_LEVEL * level
end

function Config.currentDay(): number
	return math.floor(os.time() / 86400) -- Tageszähler in UTC
end

return Config
