"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useGame } from "@/components/context/game-context"
import { Sprout, Coins, X, Clock, Zap, TrendingUp } from "lucide-react"

interface CropPlantingDialogProps {
  isOpen: boolean
  onClose: () => void
  tileId: string
  position: { x: number; y: number }
}

const cropTypes = [
  {
    id: "wheat",
    name: "Wheat",
    icon: "🌾",
    cost: 10,
    sellPrice: 25,
    growTime: 400,
    xp: 5,
    description: "A reliable staple crop that grows quickly and provides steady income",
    rarity: "common",
  },
  {
    id: "corn",
    name: "Corn",
    icon: "🌽",
    cost: 15,
    sellPrice: 40,
    growTime: 600,
    xp: 8,
    description: "A hearty crop that takes longer to grow but offers better returns",
    rarity: "common",
  },
  {
    id: "tomato",
    name: "Tomato",
    icon: "🍅",
    cost: 20,
    sellPrice: 60,
    growTime: 800,
    xp: 12,
    description: "A valuable crop that requires patience but yields excellent profits",
    rarity: "rare",
  },
  {
    id: "carrot",
    name: "Carrot",
    icon: "🥕",
    cost: 12,
    sellPrice: 35,
    growTime: 500,
    xp: 7,
    description: "A nutritious root vegetable that grows at a moderate pace",
    rarity: "common",
  },
  {
    id: "pumpkin",
    name: "Pumpkin",
    icon: "🎃",
    cost: 30,
    sellPrice: 100,
    growTime: 1200,
    xp: 20,
    description: "A premium crop that takes the longest to grow but offers the highest rewards",
    rarity: "epic",
  },
]

export default function CropPlantingDialog({ isOpen, onClose, tileId, position }: CropPlantingDialogProps) {
  const { gameState, updateGameTile, updateResources } = useGame()
  const [selectedCrop, setSelectedCrop] = useState(cropTypes[0])
  const [isPlanting, setIsPlanting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const tile = gameState.tiles.find((t) => t.id === tileId)

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCrop(cropTypes[0])
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

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-green-300 bg-green-50/60"
      case "rare":
        return "border-blue-300 bg-blue-50/60"
      case "epic":
        return "border-purple-300 bg-purple-50/60"
      case "legendary":
        return "border-yellow-300 bg-yellow-50/60"
      default:
        return "border-gray-300 bg-gray-50/60"
    }
  }

  const handlePlantCrop = () => {
    if (!tile) return

    // Check if player has enough gold
    if (gameState.resources.gold < selectedCrop.cost) {
      setError(`Not enough gold! You need ${selectedCrop.cost} gold to plant this crop.`)
      playSound(200, 0.5) // Error sound
      setTimeout(() => setError(""), 3000)
      return
    }

    setIsPlanting(true)
    setError("")

    // Gentle planting sound
    playSound(440, 0.3, 0.06) // Soft A4
    setTimeout(() => playSound(523, 0.3, 0.04), 150) // Gentle C5
    setTimeout(() => playSound(659, 0.4, 0.03), 300) // Soft E5

    setTimeout(() => {
      // Deduct cost
      updateResources({
        gold: gameState.resources.gold - selectedCrop.cost,
      })

      // Plant the crop
      updateGameTile(tileId, {
        type: "crop",
        growth: 0,
        cropType: selectedCrop.id,
      })

      setIsPlanting(false)
      setIsSuccess(true)

      // Success chime
      playSound(880, 0.5, 0.04)

      setTimeout(() => {
        onClose()
      }, 2000)
    }, 1500)
  }

  if (!isOpen || !tile) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-lg my-auto min-h-0">
        <Card className="w-full max-w-lg glass-card-transparent border-2 border-green-200/30 shadow-2xl relative overflow-hidden">
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
                      "#78C850", // grass green
                      "#228B22", // forest green
                      "#32CD32", // lime green
                      "#FFD700", // gold
                      "#FF6347", // tomato
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
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <Sprout className="h-8 w-8 text-green-600" />
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-green-100">
                <X className="h-4 w-4 text-green-500" />
              </Button>
            </div>
            <CardTitle className="text-2xl font-semibold text-green-800">🌱 Plant Crop</CardTitle>
            <p className="text-green-600 mt-2">Choose a crop to plant and watch your farm flourish!</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Crop Type Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-green-700 text-lg">Select Crop Type:</h3>
              <div className="grid grid-cols-2 gap-3">
                {cropTypes.map((crop) => (
                  <Card
                    key={crop.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedCrop.id === crop.id
                        ? "border-2 border-green-400 bg-green-50/60 shadow-lg scale-105"
                        : `border ${getRarityColor(crop.rarity)} hover:border-green-300 hover:bg-green-50/30`
                    }`}
                    onClick={() => setSelectedCrop(crop)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{crop.icon}</div>
                      <div className="font-medium text-green-800 text-sm">{crop.name}</div>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Coins className="w-3 h-3 text-yellow-600" />
                        <span className="text-xs font-bold text-yellow-700">{crop.cost}g</span>
                      </div>
                      <div className="text-xs text-green-600 mt-1 capitalize">{crop.rarity}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Selected Crop Details */}
            <Card className="bg-gradient-to-br from-green-50/60 to-lime-50/60 border border-green-200/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{selectedCrop.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-green-800 mb-2">{selectedCrop.name}</h4>
                    <p className="text-green-600 text-sm mb-3 leading-relaxed">{selectedCrop.description}</p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Coins className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-green-700">Cost: {selectedCrop.cost}g</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-700">Sell: {selectedCrop.sellPrice}g</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-green-700">Time: {selectedCrop.growTime}s</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-green-700">XP: {selectedCrop.xp}</span>
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-green-100/50 rounded-lg">
                      <div className="text-sm font-medium text-green-700">
                        Profit: {selectedCrop.sellPrice - selectedCrop.cost}g (
                        {Math.round(((selectedCrop.sellPrice - selectedCrop.cost) / selectedCrop.cost) * 100)}% return)
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
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 animate-bounce shadow-lg">
                      <Sprout className="h-12 w-12 text-green-600" />
                    </div>
                    <div className="absolute inset-0 bg-green-300/20 rounded-full animate-ping" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-green-600">Crop Planted!</h3>
                    <p className="text-green-600 font-medium">Your {selectedCrop.name.toLowerCase()} is now growing!</p>
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
              onClick={handlePlantCrop}
              disabled={isPlanting || gameState.resources.gold < selectedCrop.cost}
            >
              {isPlanting ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Planting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sprout className="h-4 w-4" />🌱 Plant Crop ({selectedCrop.cost}g)
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
