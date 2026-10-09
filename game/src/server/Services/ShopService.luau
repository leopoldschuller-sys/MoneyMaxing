-- ShopService (ModuleScript) -> ServerScriptService/Services
-- Game Passes (dauerhafte Käufe) und Developer Products (Käufe, die man wiederholen kann).
-- IDs trägst du in Config.GAME_PASSES / Config.PRODUCTS ein (0 = noch nicht gesetzt).

local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Config = require(ReplicatedStorage:WaitForChild("Config"))
local DataService = require(script.Parent.DataService)
local EconomyService = require(script.Parent.EconomyService)

local ShopService = {}

local MAX_PURCHASE_HISTORY = 100
local owned = {} -- [Player] = { [PassName] = true }
local onChanged = function(_player) end

function ShopService.ownsPass(player, passName: string): boolean
	local passes = owned[player]
	return passes ~= nil and passes[passName] == true
end

local function loadOwnership(player)
	local passes = {}
	owned[player] = passes
	for name, id in Config.GAME_PASSES do
		if id ~= 0 then
			local ok, result = pcall(function()
				return MarketplaceService:UserOwnsGamePassAsync(player.UserId, id)
			end)
			if ok and result == true then
				passes[name] = true
			end
		end
	end
	onChanged(player)
end

local function alreadyProcessed(data, purchaseId: string): boolean
	for _, id in data.purchases do
		if id == purchaseId then
			return true
		end
	end
	return false
end

-- Roblox ruft das für jeden Developer-Product-Kauf auf und wiederholt es, bis wir
-- PurchaseGranted zurückgeben. Darum: idempotent (doppelt aufgerufen = nur einmal belohnen).
function ShopService.processReceipt(receiptInfo)
	local notYet = Enum.ProductPurchaseDecision.NotProcessedYet
	local granted = Enum.ProductPurchaseDecision.PurchaseGranted

	local player = Players:GetPlayerByUserId(receiptInfo.PlayerId)
	if not player then
		return notYet -- Spieler ist weg; Roblox probiert es beim nächsten Beitritt erneut
	end
	local data = DataService.get(player)
	if not data then
		return notYet
	end

	local purchaseId = tostring(receiptInfo.PurchaseId)
	if alreadyProcessed(data, purchaseId) then
		return if DataService.saveNow(player) then granted else notYet
	end

	for name, product in Config.PRODUCTS do
		if product.id ~= 0 and product.id == receiptInfo.ProductId then
			EconomyService.addCoins(player, product.coins, "purchase:" .. name)
			table.insert(data.purchases, purchaseId)
			while #data.purchases > MAX_PURCHASE_HISTORY do
				table.remove(data.purchases, 1)
			end
			return if DataService.saveNow(player) then granted else notYet
		end
	end

	warn("[ShopService] Unbekanntes Produkt: " .. tostring(receiptInfo.ProductId))
	return notYet
end

function ShopService.start(onOwnershipChanged)
	onChanged = onOwnershipChanged or onChanged

	Players.PlayerAdded:Connect(function(player)
		task.spawn(loadOwnership, player)
	end)
	for _, player in Players:GetPlayers() do
		task.spawn(loadOwnership, player)
	end
	Players.PlayerRemoving:Connect(function(player)
		owned[player] = nil
	end)

	MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player, passId, wasPurchased)
		if not wasPurchased then
			return
		end
		for name, id in Config.GAME_PASSES do
			if id ~= 0 and id == passId then
				owned[player] = owned[player] or {}
				owned[player][name] = true
				onChanged(player)
			end
		end
	end)

	MarketplaceService.ProcessReceipt = ShopService.processReceipt
end

return ShopService
