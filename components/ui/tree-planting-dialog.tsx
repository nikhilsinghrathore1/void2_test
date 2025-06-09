"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useGame } from "@/components/context/game-context"
import { TreePine, Coins, X, Sparkles, Leaf } from "lucide-react"

interface TreePlantingDialogProps {
  isOpen: boolean
  onClose: () => void
  tileId: string
  position: { x: number; y: number }
}

const treeTypes = [
  {
    id: "power",
    name: "power plant",
    icon: "🌲",
    cost: 15,
    description: "A majestic power plant that gives electricity and provides excellent shade",
    growthTime: "Instant",
    benefits: "Increases tile beauty, provides shade",
  },

  
]

export default function TreePlantingDialog({ isOpen, onClose, tileId, position }: TreePlantingDialogProps) {
  const { gameState, updateGameTile, updateResources } = useGame()
  const [selectedTreeType, setSelectedTreeType] = useState(treeTypes[0])
  const [isPlanting, setIsPlanting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const tile = gameState.tiles.find((t) => t.id === tileId)

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTreeType(treeTypes[0])
      setIsPlanting(false)
      setIsSuccess(false)
      setError("")
    }
  }, [isOpen])

  // Enhanced sound effects
  const playSound = (frequency: number, duration: number, volume = 0.08) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)

      setTimeout(() => audioContext.close(), duration * 1000)
    } catch (error) {
      console.log("Audio not available")
    }
  }

  const handlePlantTree = () => {
    if (!tile) return

    // Check if player has enough gold
    if (gameState.resources.gold < selectedTreeType.cost) {
      setError(`Not enough gold! You need ${selectedTreeType.cost} gold to plant this tree.`)
      playSound(200, 0.5) // Error sound
      setTimeout(() => setError(""), 3000)
      return
    }

    setIsPlanting(true)
    setError("")

    // Gentle planting sound
    playSound(523, 0.3, 0.06) // Soft C5
    setTimeout(() => playSound(659, 0.3, 0.04), 150) // Gentle E5
    setTimeout(() => playSound(784, 0.4, 0.03), 300) // Soft G5

    setTimeout(() => {
      // Deduct cost
      updateResources({
        gold: gameState.resources.gold - selectedTreeType.cost,
      })

      // Plant the tree (we'll add tree type to tile data)
      updateGameTile(tileId, {
        type: "tree" as any, // We'll need to add this type
        treeType: selectedTreeType.id,
      })

      setIsPlanting(false)
      setIsSuccess(true)

      // Success chime
      playSound(1047, 0.5, 0.04)

      setTimeout(() => {
        onClose()
      }, 2000)
    }, 1500)
  }

  if (!isOpen || !tile) return null

  return (
    <div className="fixed inset-0 z-50 flex  items-center justify-center bg-black/20 overflow-auto backdrop-blur-sm">
      <div className="animate-scale-in overflow-auto">
        <Card className="w-full max-w-lg h-fit glass-card-transparent border-2 border-sage-200/30 shadow-2xl relative overflow-y-auto">
          {/* Success confetti effect */}
          {isSuccess && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-confetti-gentle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    backgroundColor: [
                      "#2e8b57", // forest green
                      "#3cb371", // medium sea green
                      "#228b22", // forest green
                      "#ffd700", // gold
                      "#32cd32", // lime green
                    ][Math.floor(Math.random() * 5)],
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${4 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          )}

          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1" />
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
                <TreePine className="h-8 w-8 text-emerald-600" />
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-sage-100">
                <X className="h-4 w-4 text-sage-500" />
              </Button>
            </div>
            <CardTitle className="text-2xl font-semibold text-sage-800">Plant a Tree</CardTitle>
            <p className="text-sage-600 mt-2">Choose a beautiful tree to enhance your farm's natural beauty</p>
          </CardHeader>

          <CardContent className="space-y-6 overflow-y-auto ">
            {/* Tree Type Selection */}
            <div className="space-y-4 ">
              <h3 className="font-semibold text-sage-700 text-lg">Select Tree Type:</h3>
              <div className="grid grid-cols-2 gap-3">
                {treeTypes.map((tree) => (
                  <Card
                    key={tree.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedTreeType.id === tree.id
                        ? "border-2 border-emerald-400 bg-emerald-50/60 shadow-lg scale-105"
                        : "border border-sage-200 hover:border-emerald-300 hover:bg-emerald-50/30"
                    }`}
                    onClick={() => setSelectedTreeType(tree)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{tree.icon}</div>
                      <div className="font-medium text-sage-800 text-sm">{tree.name}</div>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Coins className="w-3 h-3 text-yellow-600" />
                        <span className="text-xs font-bold text-yellow-700">{tree.cost}g</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Selected Tree Details */}
            <Card className="bg-gradient-to-br from-emerald-50/60 to-sage-50/60 border border-emerald-200/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{selectedTreeType.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-sage-800 mb-2">{selectedTreeType.name}</h4>
                    <p className="text-sage-600 text-sm mb-3 leading-relaxed">{selectedTreeType.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Coins className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-sage-700">Cost: {selectedTreeType.cost} Gold</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-sage-700">Growth: {selectedTreeType.growthTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-sage-700">Benefits: {selectedTreeType.benefits}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error message */}
            {error && (
              <Card className="bg-rose-50/60 border border-rose-200/50">
                <CardContent className="p-4 text-center">
                  <div className="text-rose-700 font-medium">{error}</div>
                </CardContent>
              </Card>
            )}

            {/* Success animation overlay */}
            {isSuccess && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-3xl animate-float-up">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 animate-bounce shadow-lg">
                      <TreePine className="h-12 w-12 text-emerald-600" />
                    </div>
                    <div className="absolute inset-0 bg-emerald-300/20 rounded-full animate-ping" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-emerald-600">Tree Planted!</h3>
                    <p className="text-sage-600 font-medium">
                      Your {selectedTreeType.name.toLowerCase()} is now growing!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex gap-4 pt-6">
            <Button variant="outline" className="flex-1 btn-secondary" onClick={onClose} disabled={isPlanting}>
              Cancel
            </Button>
            <Button
              className={`flex-1 btn-success ${isSuccess ? "animate-bounce" : ""}`}
              onClick={handlePlantTree}
              disabled={isPlanting || gameState.resources.gold < selectedTreeType.cost}
            >
              {isPlanting ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Planting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <TreePine className="h-4 w-4" />🌱 Click to Plant ({selectedTreeType.cost}g)
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
