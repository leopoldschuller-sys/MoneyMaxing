-- Client (LocalScript) -> StarterPlayer/StarterPlayerScripts
-- Baut eine einfache, handytaugliche Oberfläche per Code und zeigt den Zustand an,
-- den der Server schickt. Ersetze das später durch dein eigenes UI-Design.

local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local player = Players.LocalPlayer
local Config = require(ReplicatedStorage:WaitForChild("Config"))
local remotes = ReplicatedStorage:WaitForChild("Remotes")

local function formatNumber(n: number): string
	local suffixes = { "", "K", "M", "B", "T" }
	local index = 1
	while n >= 1000 and index < #suffixes do
		n /= 1000
		index += 1
	end
	if index == 1 then
		return tostring(math.floor(n))
	end
	return string.format("%.1f%s", n, suffixes[index])
end

local gui = Instance.new("ScreenGui")
gui.Name = "MainUI"
gui.ResetOnSpawn = false
gui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
gui.Parent = player:WaitForChild("PlayerGui")

local function styleText(label, maxSize: number)
	label.Font = Enum.Font.GothamBold
	label.TextScaled = true
	label.TextColor3 = Color3.new(1, 1, 1)
	local limit = Instance.new("UITextSizeConstraint")
	limit.MaxTextSize = maxSize
	limit.Parent = label
end

local function makeLabel(name: string, position: UDim2, size: UDim2)
	local label = Instance.new("TextLabel")
	label.Name = name
	label.AnchorPoint = Vector2.new(0.5, 0.5)
	label.Position = position
	label.Size = size
	label.BackgroundTransparency = 1
	label.Parent = gui
	styleText(label, 30)
	return label
end

local function makeButton(name: string, text: string, position: UDim2, size: UDim2, color: Color3)
	local button = Instance.new("TextButton")
	button.Name = name
	button.Text = text
	button.AnchorPoint = Vector2.new(0.5, 0.5)
	button.Position = position
	button.Size = size
	button.BackgroundColor3 = color
	button.Parent = gui
	styleText(button, 26)
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, 12)
	corner.Parent = button
	local sizeLimit = Instance.new("UISizeConstraint")
	sizeLimit.MinSize = Vector2.new(110, 46) -- Mindestgröße zum Antippen
	sizeLimit.MaxSize = Vector2.new(320, 90)
	sizeLimit.Parent = button
	return button
end

local coinsLabel = makeLabel("Coins", UDim2.fromScale(0.5, 0.08), UDim2.fromScale(0.4, 0.07))
local hintLabel = makeLabel("Hint", UDim2.fromScale(0.5, 0.68), UDim2.fromScale(0.6, 0.06))
local noticeLabel = makeLabel("Notice", UDim2.fromScale(0.5, 0.3), UDim2.fromScale(0.7, 0.06))
hintLabel.Text = "Tippe auf SAMMELN!"
noticeLabel.Text = ""

local collectButton = makeButton(
	"Collect",
	"SAMMELN",
	UDim2.fromScale(0.5, 0.82),
	UDim2.fromScale(0.34, 0.14),
	Color3.fromRGB(37, 99, 235)
)
local upgradeButton = makeButton(
	"Upgrade",
	"UPGRADE",
	UDim2.fromScale(0.2, 0.82),
	UDim2.fromScale(0.26, 0.11),
	Color3.fromRGB(22, 163, 74)
)
local dailyButton = makeButton(
	"Daily",
	"TÄGLICH",
	UDim2.fromScale(0.8, 0.82),
	UDim2.fromScale(0.26, 0.11),
	Color3.fromRGB(245, 158, 11)
)
local shopButton = makeButton(
	"Shop",
	"2x MÜNZEN",
	UDim2.fromScale(0.5, 0.18),
	UDim2.fromScale(0.3, 0.08),
	Color3.fromRGB(147, 51, 234)
)

local noticeToken = 0
local function showNotice(text: string)
	noticeToken += 1
	local myToken = noticeToken
	noticeLabel.Text = text
	task.delay(2.5, function()
		if noticeToken == myToken then
			noticeLabel.Text = ""
		end
	end)
end

local function applyState(state)
	coinsLabel.Text = "Münzen: " .. formatNumber(state.coins)
	collectButton.Text = "SAMMELN +" .. formatNumber(state.perClick)
	if state.nextCost then
		upgradeButton.Text = "UPGRADE " .. formatNumber(state.nextCost)
		upgradeButton.BackgroundColor3 = if state.coins >= state.nextCost
			then Color3.fromRGB(22, 163, 74)
			else Color3.fromRGB(100, 116, 139)
	else
		upgradeButton.Text = "MAX"
	end
	dailyButton.Text = if state.dailyReady then "TÄGLICH" else "MORGEN"
	dailyButton.BackgroundColor3 = if state.dailyReady
		then Color3.fromRGB(245, 158, 11)
		else Color3.fromRGB(100, 116, 139)
	shopButton.Visible = state.multiplier == 1
	hintLabel.Visible = state.coins == 0 and state.level == 0
end

collectButton.Activated:Connect(function()
	remotes.Collect:FireServer()
end)
upgradeButton.Activated:Connect(function()
	remotes.BuyUpgrade:FireServer()
end)
dailyButton.Activated:Connect(function()
	remotes.ClaimDaily:FireServer()
end)
shopButton.Activated:Connect(function()
	local id = Config.GAME_PASSES.DoubleCoins
	if id ~= 0 then
		MarketplaceService:PromptGamePassPurchase(player, id)
	else
		showNotice("Trage zuerst die Game-Pass-ID in Config ein.")
	end
end)

remotes.State.OnClientEvent:Connect(applyState)
remotes.Notice.OnClientEvent:Connect(showNotice)
remotes.RequestState:FireServer() -- Startzustand anfordern (falls wir den ersten Push verpasst haben)
