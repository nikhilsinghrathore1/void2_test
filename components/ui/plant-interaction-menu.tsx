"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useGame } from "@/components/context/game-context"
import { Droplet, Flower, Search, X, Sparkles } from "lucide-react"

interface PlantInteractionMenuProps {
  isOpen: boolean
  onClose: () => void
  position: { x: number; y: number }
  tileId: string
}

export default function PlantInteractionMenu({ isOpen, onClose, position, tileId }: PlantInteractionMenuProps) {
  const { gameState, updateGameTile, updateResources } = useGame()
  const [showWaterEffect, setShowWaterEffect] = useState(false)
  const [showFertilizeEffect, setShowFertilizeEffect] = useState(false)
  const [boostMessage, setBoostMessage] = useState("")

  const tile = gameState.tiles.find((t) => t.id === tileId)

  const handleWater = () => {
    if (!tile) return

    // Show gentle water effect
    setShowWaterEffect(true)
    setTimeout(() => setShowWaterEffect(false), 3000)

    // Apply growth boost
    const growthBoost = 5
    const newGrowth = Math.min(100, tile.growth + growthBoost)
    updateGameTile(tileId, { growth: newGrowth })

    // Show boost message
    setBoostMessage(`+${growthBoost}% Growth ✨`)
    setTimeout(() => setBoostMessage(""), 3000)

    // Use some energy
    updateResources({
      energy: Math.max(0, gameState.resources.energy - 5),
    })

    // Close menu after a delay
    setTimeout(() => onClose(), 3000)
  }

  const handleFertilize = () => {
    if (!tile) return

    // Check if player has fertilizer
    const fertilizer = gameState.inventory.find((item) => item.name === "Fertilizer" && item.quantity > 0)
    if (!fertilizer) {
      setBoostMessage("No fertilizer available! 🌱")
      setTimeout(() => setBoostMessage(""), 3000)
      return
    }

    // Show gentle fertilize effect
    setShowFertilizeEffect(true)
    setTimeout(() => setShowFertilizeEffect(false), 3000)

    // Apply significant growth boost
    const growthBoost = 15
    const newGrowth = Math.min(100, tile.growth + growthBoost)
    updateGameTile(tileId, { growth: newGrowth })

    // Show boost message
    setBoostMessage(`+${growthBoost}% Growth 🌿`)
    setTimeout(() => setBoostMessage(""), 3000)

    // Close menu after a delay
    setTimeout(() => onClose(), 3000)
  }

  const handleInspect = () => {
    if (!tile) return

    // Show detailed info about the plant
    setBoostMessage(`Growth: ${tile.growth}% 🔍`)
    setTimeout(() => setBoostMessage(""), 4000)
  }

  if (!isOpen || !tile) return null

  return (
    <div
      className="fixed z-40 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* Radial menu with soothing design */}
      <div className="absolute left-0 top-0 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto animate-scale-in">
        <div className="relative">
          {/* Close button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute -top-3 -right-3 h-8 w-8 rounded-full z-10 glass-card border-sage-200 shadow-lg"
            onClick={onClose}
          >
            <X className="h-3 w-3 text-sage-600" />
          </Button>

          {/* Menu buttons with enhanced styling */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-full glass-card border-2 border-blue-200/50 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
              onClick={handleWater}
            >
              <Droplet className="h-6 w-6 text-blue-600" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-full glass-card border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
              onClick={handleFertilize}
            >
              <Flower className="h-6 w-6 text-emerald-600" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-full glass-card border-2 border-lavender-200/50 bg-gradient-to-br from-lavender-50 to-lavender-100 hover:from-lavender-100 hover:to-lavender-200 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
              onClick={handleInspect}
            >
              <Search className="h-6 w-6 text-lavender-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Gentle water effect */}
      {showWaterEffect && (
        <div className="absolute left-0 top-0 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="relative">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div
                  className="w-16 h-16 bg-blue-400/20 rounded-full animate-ping"
                  style={{ animationDuration: "2s" }}
                />
              </div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Gentle fertilize effect */}
      {showFertilizeEffect && (
        <div className="absolute left-0 top-0 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="relative">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div
                  className="w-16 h-16 bg-emerald-400/20 rounded-full animate-ping"
                  style={{ animationDuration: "2s" }}
                />
              </div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Boost message with soothing design */}
      {boostMessage && (
        <div className="absolute left-0 top-0 transform -translate-x-1/2 -translate-y-20 pointer-events-none animate-float-up">
          <div className="glass-card px-4 py-2 rounded-2xl shadow-lg border border-sage-200/50">
            <span className="font-semibold text-sage-700">{boostMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}
