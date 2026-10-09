-- Analytics (ModuleScript) -> ServerScriptService/Services
-- Dünne Hülle um Roblox' AnalyticsService. Jeder Aufruf steckt in pcall:
-- Ändert Roblox einen Funktionsnamen, läuft dein Spiel trotzdem weiter
-- (du siehst dann EINE Warnung im Output). Signaturen in der aktuellen Doku prüfen!

local AnalyticsService = game:GetService("AnalyticsService")

local Analytics = {}

local warned = false

local function safe(fn)
	local ok, err = pcall(fn)
	if not ok and not warned then
		warned = true
		warn("[Analytics] Aufruf fehlgeschlagen (Signatur in der Doku prüfen): " .. tostring(err))
	end
end

-- Onboarding-Trichter: step 1, 2, 3 ... in der Reihenfolge, in der Spieler sie erreichen
function Analytics.step(player, step: number, name: string)
	safe(function()
		AnalyticsService:LogOnboardingFunnelStepEvent(player, step, name)
	end)
end

-- Eigene Ereignisse, z. B. Analytics.custom(player, "daily_claimed", 1)
function Analytics.custom(player, eventName: string, value: number?)
	safe(function()
		AnalyticsService:LogCustomEvent(player, eventName, value or 1)
	end)
end

-- Wirtschaft: isSource = true (Münzen kommen rein), false (Münzen werden ausgegeben).
-- reason ist ein kurzer Text wie "upgrade", "daily" oder "purchase:Coins500" (landet als itemSku).
function Analytics.economy(
	player,
	isSource: boolean,
	currency: string,
	endingBalance: number,
	amount: number,
	reason: string
)
	safe(function()
		local flow = if isSource
			then Enum.AnalyticsEconomyFlowType.Source
			else Enum.AnalyticsEconomyFlowType.Sink
		local txType = if string.sub(reason, 1, 8) == "purchase" then "IAP" else "Gameplay"
		pcall(function() -- bevorzugt die offiziellen Enum-Namen, falls vorhanden
			txType = Enum.AnalyticsEconomyTransactionType[txType].Name
		end)
		AnalyticsService:LogEconomyEvent(
			player,
			flow,
			currency,
			endingBalance,
			amount,
			txType,
			reason
		)
	end)
end

return Analytics
