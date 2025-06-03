"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useGame } from "@/components/context/game-context"
import { Sprout, Clock, Zap, Coins, Droplets } from "lucide-react"

const crops = [
  {
    id: "wheat",
    name: "Wheat",
    icon: "🌾",
    growTime: 400, // Changed from 60 to 400 seconds (6.7 minutes)
    cost: 10,
    sellPrice: 25,
    xp: 5,
    rarity: "common",
  },
  {
    id: "corn",
    name: "Corn",
    icon: "🌽",
    growTime: 600, // Changed from 90 to 600 seconds (10 minutes)
    cost: 15,
    sellPrice: 40,
    xp: 8,
    rarity: "common",
  },
  {
    id: "tomato",
    name: "Tomato",
    icon: "🍅",
    growTime: 800, // Changed from 120 to 800 seconds (13.3 minutes)
    cost: 20,
    sellPrice: 60,
    xp: 12,
    rarity: "rare",
  },
  {
    id: "carrot",
    name: "Carrot",
    icon: "🥕",
    growTime: 500, // Changed from 75 to 500 seconds (8.3 minutes)
    cost: 12,
    sellPrice: 35,
    xp: 7,
    rarity: "common",
  },
  {
    id: "pumpkin",
    name: "Pumpkin",
    icon: "🎃",
    growTime: 1200, // Changed from 180 to 1200 seconds (20 minutes)
    cost: 30,
    sellPrice: 100,
    xp: 20,
    rarity: "epic",
  },
]

interface FarmModeProps {
  setSelectedTool?: (tool: "move" | "buy" | "plant" | "harvest") => void
}

export default function FarmMode({ setSelectedTool }: FarmModeProps) {
  const { gameState, updateResources } = useGame()

  const plantCrop = (crop: (typeof crops)[0]) => {
    if (gameState.resources.gold >= crop.cost) {
      updateResources({
        gold: gameState.resources.gold - crop.cost,
      })
      // Set the tool to plant mode
      if (setSelectedTool) {
        setSelectedTool("plant")
      }
    }
  }

  const harvestAll = () => {
    if (setSelectedTool) {
      setSelectedTool("harvest")
    }
  }

  const canAfford = (crop: (typeof crops)[0]) => {
    return gameState.resources.gold >= crop.cost
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800"
      case "rare":
        return "bg-blue-100 text-blue-800"
      case "epic":
        return "bg-purple-100 text-purple-800"
      case "legendary":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-20">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">🌱 Farm Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Active Crops */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5" />
                  Growing Crops
                </CardTitle>
                <Button onClick={harvestAll} variant="outline" size="sm">
                  Harvest All Ready Crops
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {gameState.tiles
                    .filter((t) => t.type === "crop")
                    .map((tile) => (
                      <Card key={tile.id} className="bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">🌾 Wheat</span>
                            <Badge variant="outline">{tile.growth}%</Badge>
                          </div>
                          <Progress value={tile.growth} className="mb-2" />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>
                              Position: {tile.position[0]}, {tile.position[2]}
                            </span>
                            <span>{tile.growth >= 100 ? "Ready!" : "Growing..."}</span>
                          </div>
                          {tile.growth >= 100 && (
                            <Button
                              size="sm"
                              className="w-full mt-2"
                              onClick={() => {
                                if (setSelectedTool) {
                                  setSelectedTool("harvest")
                                }
                              }}
                            >
                              Harvest
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                  {gameState.tiles.filter((t) => t.type === "crop").length === 0 && (
                    <div className="col-span-2 text-center text-gray-500 py-8">
                      No crops growing. Plant some seeds to get started!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Available Seeds */}
            <Card>
              <CardHeader>
                <CardTitle>Plant New Crops</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {crops.map((crop) => (
                    <Card key={crop.id} className={`${canAfford(crop) ? "border-green-300" : "border-gray-300"}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span className="text-2xl">{crop.icon}</span>
                          {crop.name}
                        </CardTitle>
                        <Badge className={getRarityColor(crop.rarity)}>{crop.rarity}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Coins className="w-4 h-4 text-yellow-500" />
                              Cost
                            </span>
                            <span className="font-medium">{crop.cost} Gold</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-blue-500" />
                              Grow Time
                            </span>
                            <span className="font-medium">{crop.growTime}s</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Coins className="w-4 h-4 text-green-500" />
                              Sell Price
                            </span>
                            <span className="font-medium">{crop.sellPrice} Gold</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Zap className="w-4 h-4 text-purple-500" />
                              XP Reward
                            </span>
                            <span className="font-medium">{crop.xp} XP</span>
                          </div>
                        </div>

                        <Button onClick={() => plantCrop(crop)} disabled={!canAfford(crop)} className="w-full">
                          {canAfford(crop) ? "Plant" : "Insufficient Gold"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Farming Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  Farming Boosters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-blue-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">💧</div>
                      <div className="font-medium">Fertilizer</div>
                      <div className="text-sm text-gray-600 mb-2">+50% growth speed</div>
                      <Button size="sm" className="w-full">
                        Use (5 Gems)
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="font-medium">Speed Boost</div>
                      <div className="text-sm text-gray-600 mb-2">Instant harvest</div>
                      <Button size="sm" className="w-full">
                        Use (10 Gems)
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">🌧️</div>
                      <div className="font-medium">Rain Dance</div>
                      <div className="text-sm text-gray-600 mb-2">Water all crops</div>
                      <Button size="sm" className="w-full">
                        Watch Ad
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
