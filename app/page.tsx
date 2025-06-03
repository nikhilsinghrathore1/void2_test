"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sky } from "@react-three/drei"
import { Suspense } from "react"
import GameWorld from "@/components/game-world"
import { Tree, TreeGroup, PineForest } from "@/components/trees"
import { CharacterGroup } from "@/components/characters"
import GameHUD from "@/components/ui/game-hud"
import BuildMode from "@/components/ui/build-mode"
import FarmMode from "@/components/ui/farm-mode"
import Marketplace from "@/components/ui/marketplace"
import Inventory from "@/components/ui/inventory"
import Profile from "@/components/ui/profile"
import Store from "@/components/ui/store"
import Settings from "@/components/ui/settings"
import GameInstructions from "@/components/ui/game-instructions"
import PlantInteractionMenu from "@/components/ui/plant-interaction-menu"
import TransactionDialog from "@/components/ui/transaction-dialog"
import EnhancedTileDialog from "@/components/ui/enhanced-tile-dialog"
import TreePlantingDialog from "@/components/ui/tree-planting-dialog"
import CropPlantingDialog from "@/components/ui/crop-planting-dialog"
import TileVisualEffects from "@/components/ui/tile-visual-effects"
import { GameProvider, useGame } from "@/components/context/game-context"

function GameContent() {
  const { gameState, currentScreen, updateGameTile, updateResources } = useGame()
  const [selectedTool, setSelectedTool] = useState<"move" | "buy" | "plant" | "harvest" | "tree">("buy")
  const [showInstructions, setShowInstructions] = useState(true)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null)

  // New UI state
  const [plantInteraction, setPlantInteraction] = useState<{
    isOpen: boolean
    tileId: string
    position: { x: number; y: number }
  }>({
    isOpen: false,
    tileId: "",
    position: { x: 0, y: 0 },
  })

  const [transactionDialog, setTransactionDialog] = useState<{
    isOpen: boolean
    type: "buy" | "sell"
    item: any
  }>({
    isOpen: false,
    type: "buy",
    item: null,
  })

  // New state for tile transactions
  const [tileTransactionDialog, setTileTransactionDialog] = useState<{
    isOpen: boolean
    type: "buy" | "sell" | "error"
    tileId: string
    errorMessage?: string
  }>({
    isOpen: false,
    type: "buy",
    tileId: "",
    errorMessage: "",
  })

  // New state for tree planting dialog
  const [treePlantingDialog, setTreePlantingDialog] = useState<{
    isOpen: boolean
    tileId: string
    position: { x: number; y: number }
  }>({
    isOpen: false,
    tileId: "",
    position: { x: 0, y: 0 },
  })

  // New state for crop planting dialog
  const [cropPlantingDialog, setCropPlantingDialog] = useState<{
    isOpen: boolean
    tileId: string
    position: { x: number; y: number }
  }>({
    isOpen: false,
    tileId: "",
    position: { x: 0, y: 0 },
  })

  const [activeEffect, setActiveEffect] = useState<{
    tileId: string
    effect: "purchase" | "sale" | "glow" | null
    position: [number, number, number]
  } | null>(null)

  // Show temporary messages
  const showMessage = (text: string, type: "success" | "error" | "info" = "success") => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  // Close instructions after 8 seconds
  useEffect(() => {
    if (showInstructions) {
      const timer = setTimeout(() => {
        setShowInstructions(false)
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [showInstructions])

  // Handle plant interaction
  const handlePlantInteraction = (tileId: string, position: { x: number; y: number }) => {
    setPlantInteraction({
      isOpen: true,
      tileId,
      position,
    })
  }

  // Handle tile transaction
  const handleTileTransaction = (tileId: string, type: "buy" | "sell") => {
    const tile = gameState.tiles.find((t) => t.id === tileId)
    if (!tile) return

    if (type === "buy" && gameState.resources.gold < 20) {
      setTileTransactionDialog({
        isOpen: true,
        type: "error",
        tileId,
        errorMessage: `You need 20 gold to purchase this tile. You currently have ${gameState.resources.gold} gold.`,
      })
      return
    }

    setTileTransactionDialog({
      isOpen: true,
      type,
      tileId,
    })
  }

  // Handle tree planting
  const handleTreePlanting = (tileId: string, position: { x: number; y: number }) => {
    setTreePlantingDialog({
      isOpen: true,
      tileId,
      position,
    })
  }

  // Handle crop planting
  const handleCropPlanting = (tileId: string, position: { x: number; y: number }) => {
    setCropPlantingDialog({
      isOpen: true,
      tileId,
      position,
    })
  }

  // Handle tile click with all features
  const handleTileClick = (tileId: string) => {
    const tile = gameState.tiles.find((t) => t.id === tileId)
    if (!tile) return

    switch (selectedTool) {
      case "move":
        showMessage(`Selected tile ${tileId}! 🎯`, "info")
        break

      case "buy":
        // Buy/sell logic is now handled by the TileTransactionDialog
        // The dialog is triggered in the GameWorld component
        break

      case "plant":
        if (tile.type === "land") {
          // Show crop planting dialog instead of immediate planting
          handleCropPlanting(tileId, { x: 400, y: 300 })
        } else if (tile.type === "empty") {
          showMessage("Buy this land first before planting! 🛒", "info")
        } else if (tile.type === "crop") {
          showMessage("There's already a crop growing here! 🌿", "info")
        } else if (tile.type === "money-tree") {
          showMessage("There's a money tree here! Harvest it instead! 💰", "info")
        } else if (tile.type === "tree") {
          showMessage("There's already a tree here! 🌲", "info")
        }
        break

      case "tree":
        if (tile.type === "land") {
          // Show tree planting dialog
          handleTreePlanting(tileId, { x: 400, y: 300 })
        } else if (tile.type === "empty") {
          showMessage("Buy this land first before planting trees! 🛒", "info")
        } else if (tile.type === "crop") {
          showMessage("Remove the crop first before planting a tree! 🌿", "info")
        } else if (tile.type === "tree") {
          showMessage("There's already a tree here! 🌲", "info")
        } else if (tile.type === "money-tree") {
          showMessage("There's a money tree here! Can't plant another tree! 💰", "info")
        }
        break

      case "harvest":
        if (tile.type === "crop" && tile.growth >= 100) {
          const earnings = 25
          updateResources({
            gold: gameState.resources.gold + earnings,
            energy: Math.max(0, gameState.resources.energy - 5),
          })

          const newHarvestCount = tile.harvestCount + 1
          if (newHarvestCount >= 3) {
            updateGameTile(tileId, { type: "money-tree", growth: 0, harvestCount: 0 })
            showMessage("🎉 MONEY TREE GROWN! This spot now gives 100 gold per harvest! 💰🌳", "success")
          } else {
            updateGameTile(tileId, { type: "land", growth: 0, harvestCount: newHarvestCount })
            showMessage(`Harvested for ${earnings} gold! (${newHarvestCount}/3 harvests for money tree) 💰`, "success")
          }
        } else if (tile.type === "money-tree") {
          const earnings = 100
          updateResources({
            gold: gameState.resources.gold + earnings,
            energy: Math.max(0, gameState.resources.energy - 10),
          })
          updateGameTile(tileId, { growth: 0 })
          showMessage(`💰💰💰 MONEY TREE HARVESTED! Earned ${earnings} gold! 💰💰💰`, "success")
        } else if (tile.type === "crop" && tile.growth < 100) {
          showMessage(`Crop is still growing! Wait until it reaches 100% (currently ${tile.growth}%) 🌱`, "info")
        } else if (tile.type === "empty") {
          showMessage("Nothing to harvest here! Buy land and plant crops first! 🛒", "info")
        } else if (tile.type === "land") {
          showMessage("No crops to harvest! Plant something first! 🌱", "info")
        } else if (tile.type === "tree") {
          showMessage("Trees don't produce harvestable crops! They're for beauty! 🌲", "info")
        }
        break
    }
  }

  // Auto-grow crops with milestone notifications
  useEffect(() => {
    const interval = setInterval(() => {
      gameState.tiles.forEach((tile) => {
        if (tile.type === "crop" && tile.growth < 100) {
          const newGrowth = Math.min(100, tile.growth + 0.5) // Changed from +2 to +0.5 (4x slower)
          updateGameTile(tile.id, { growth: newGrowth })

          // Show growth milestone messages
          if (newGrowth >= 25 && tile.growth < 25) {
            showMessage("🌱 Some crops are sprouting!", "info")
          } else if (newGrowth >= 50 && tile.growth < 50) {
            showMessage("🌿 Some crops are halfway grown!", "info")
          } else if (newGrowth >= 75 && tile.growth < 75) {
            showMessage("🌾 Some crops are almost ready!", "info")
          } else if (newGrowth === 100 && tile.growth < 100) {
            showMessage("🎉 Crops are ready to harvest!", "success")
          }
        }
      })
    }, 2000) // Changed from 500ms to 2000ms (4x slower interval)

    return () => clearInterval(interval)
  }, [gameState.tiles])

  // Auto-regenerate energy
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.resources.energy < gameState.resources.maxEnergy) {
        updateResources({
          energy: Math.min(gameState.resources.maxEnergy, gameState.resources.energy + 1),
        })
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [gameState.resources.energy])

  const renderScreen = () => {
    switch (currentScreen) {
      case "dashboard":
        return null // Show the 3D world
      case "build":
        return <BuildMode />
      case "farm":
        return <FarmMode setSelectedTool={setSelectedTool} />
      case "marketplace":
        return <Marketplace />
      case "inventory":
        return <Inventory />
      case "profile":
        return <Profile />
      case "store":
        return <Store />
      case "settings":
        return <Settings />
      default:
        return null
    }
  }

  return (
    <div className="w-full h-screen gradient-sky relative overflow-hidden">
      {/* 3D Game World - Always visible */}
      <Canvas camera={{ position: [12, 8, 12], fov: 60 }} shadows>
        <Suspense fallback={null}>
          {/* Refined dreamy sky gradient */}
          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
            rayleigh={1.0}
            turbidity={0.4}
          />

          {/* Enhanced dreamy lighting with refined colors */}
          <ambientLight intensity={0.8} color="#f8cfff" />
          <directionalLight
            position={[10, 20, 5]}
            intensity={2.0}
            color="#b2e0ff"
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />

          {/* Soft dreamy fill lights with refined tones */}
          <directionalLight position={[-5, 10, -5]} intensity={0.7} color="#2e8b57" />
          <directionalLight position={[5, 15, -10]} intensity={0.5} color="#f8cfff" />

          {/* Enhanced ambient fog for depth with refined color */}
          <fog attach="fog" args={["#e0f7fa", 25, 80]} />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={8}
            maxDistance={25}
            enabled={currentScreen === "dashboard"}
          />

          <GameWorld
            tiles={gameState.tiles}
            onTileClick={handleTileClick}
            selectedTool={selectedTool}
            onPlantInteraction={handlePlantInteraction}
            onTileTransaction={handleTileTransaction}
          />

          {/* Enhanced Pine Forests with dreamy muted colors */}
          <PineForest position={[-15, 0, -15]} count={8} />
          <PineForest position={[15, 0, -15]} count={6} />
          <PineForest position={[-15, 0, 15]} count={7} />
          <PineForest position={[15, 0, 15]} count={8} />

          {/* Beautiful mixed tree groups with vibrant colors */}
          <TreeGroup position={[-12, 0, -8]} count={4} />
          <TreeGroup position={[12, 0, -8]} count={3} />
          <TreeGroup position={[-8, 0, 12]} count={3} />
          <TreeGroup position={[8, 0, 12]} count={4} />

          {/* Individual accent trees with enhanced pine colors */}
          <Tree position={[-6, 0, -18]} type="pine" scale={1.6} />
          <Tree position={[6, 0, -18]} type="pine" scale={1.4} />
          <Tree position={[-18, 0, 6]} type="pine" scale={1.5} />
          <Tree position={[18, 0, 0]} type="pine" scale={1.7} />
          <Tree position={[0, 0, 18]} type="pine" scale={1.3} />

          {/* Voxel characters - positioned naturally */}
          <CharacterGroup position={[-10, 0, 10]} count={1} />
        </Suspense>
      </Canvas>

      {/* Game HUD - Always visible */}
      <GameHUD
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        message={message}
        showMessage={showMessage}
      />

      {/* Plant Interaction Menu */}
      <PlantInteractionMenu
        isOpen={plantInteraction.isOpen}
        onClose={() => setPlantInteraction({ ...plantInteraction, isOpen: false })}
        position={plantInteraction.position}
        tileId={plantInteraction.tileId}
      />

      {/* Transaction Dialog */}
      {transactionDialog.isOpen && transactionDialog.item && (
        <TransactionDialog
          isOpen={transactionDialog.isOpen}
          onClose={() => setTransactionDialog({ ...transactionDialog, isOpen: false })}
          type={transactionDialog.type}
          item={transactionDialog.item}
        />
      )}

      {/* Enhanced Tile Transaction Dialog */}
      <EnhancedTileDialog
        isOpen={tileTransactionDialog.isOpen}
        onClose={() => setTileTransactionDialog({ ...tileTransactionDialog, isOpen: false })}
        type={tileTransactionDialog.type}
        tileId={tileTransactionDialog.tileId}
        errorMessage={tileTransactionDialog.errorMessage}
      />

      {/* Tree Planting Dialog */}
      <TreePlantingDialog
        isOpen={treePlantingDialog.isOpen}
        onClose={() => setTreePlantingDialog({ ...treePlantingDialog, isOpen: false })}
        tileId={treePlantingDialog.tileId}
        position={treePlantingDialog.position}
      />

      {/* Crop Planting Dialog */}
      <CropPlantingDialog
        isOpen={cropPlantingDialog.isOpen}
        onClose={() => setCropPlantingDialog({ ...cropPlantingDialog, isOpen: false })}
        tileId={cropPlantingDialog.tileId}
        position={cropPlantingDialog.position}
      />

      {/* Tile Visual Effects */}
      {activeEffect && (
        <TileVisualEffects
          tileId={activeEffect.tileId}
          effect={activeEffect.effect}
          position={activeEffect.position}
          onEffectComplete={() => setActiveEffect(null)}
        />
      )}

      {/* Game Instructions */}
      {showInstructions && currentScreen === "dashboard" && (
        <GameInstructions onClose={() => setShowInstructions(false)} />
      )}

      {/* Current Screen UI */}
      {renderScreen()}
    </div>
  )
}

export default function TerronGame() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  )
}
