"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Navigation, ShoppingCart, Sprout, Scissors, TreePine } from "lucide-react"

interface GameUIProps {
  money: number
  totalEarned: number
  selectedTool: "move" | "buy" | "plant" | "harvest"
  setSelectedTool: (tool: "move" | "buy" | "plant" | "harvest") => void
}

export default function GameUI({ money, totalEarned, selectedTool, setSelectedTool }: GameUIProps) {
  const tools = [
    {
      id: "move" as const,
      name: "Move Player",
      icon: Navigation,
      color: "bg-gray-500",
      description: "Arrow Keys/WASD: Move player",
      cost: null,
    },
    {
      id: "buy" as const,
      name: "Buy Land",
      icon: ShoppingCart,
      color: "bg-yellow-500",
      description: "Yellow tiles: Buy land",
      cost: 20,
    },
    {
      id: "plant" as const,
      name: "Plant Crops",
      icon: Sprout,
      color: "bg-amber-600",
      description: "Brown tiles: Plant crops",
      cost: 10,
    },
    {
      id: "harvest" as const,
      name: "Harvest",
      icon: Scissors,
      color: "bg-green-500",
      description: "Green tiles: Harvest crops",
      cost: null,
    },
  ]

  return (
    <>
      {/* Money Display */}
      <Card className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border-2 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold text-green-600">${money}</span>
          </div>
          <div className="text-sm text-gray-600">Total earned: ${totalEarned}</div>
        </CardContent>
      </Card>

      {/* Controls Panel */}
      <Card className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border-2 border-blue-200 max-w-sm">
        <CardContent className="p-4">
          <div className="space-y-3">
            {tools.map((tool) => {
              const Icon = tool.icon
              const isSelected = selectedTool === tool.id
              const canAfford = tool.cost === null || money >= tool.cost

              return (
                <div key={tool.id} className="flex items-center gap-3">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTool(tool.id)}
                    disabled={!canAfford}
                    className={`w-8 h-8 p-0 ${isSelected ? tool.color : ""}`}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{tool.description}</span>
                      {tool.cost && (
                        <Badge variant="secondary" className="text-xs">
                          ${tool.cost}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <TreePine className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-800">Purple tiles: Money trees!</span>
              </div>
              <div className="text-xs text-purple-600">Harvest 3x to grow a money tree!</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Instructions */}
      <Card className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 max-w-md">
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 text-gray-800">How to Play Terron</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div>
              🎯 <strong>Goal:</strong> Build your floating farm empire!
            </div>
            <div>
              💰 <strong>Buy land</strong> → Plant crops → Harvest for profit
            </div>
            <div>
              🌳 <strong>Money trees:</strong> Harvest same spot 3 times
            </div>
            <div>
              🎮 <strong>Controls:</strong> WASD/Arrow keys to move
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
