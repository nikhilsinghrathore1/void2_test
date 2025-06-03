"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGame } from "@/components/context/game-context"
import { Zap, Coins, Clock } from "lucide-react"

const buildings = [
  {
    id: "house",
    name: "Farmhouse",
    type: "farm",
    cost: 100,
    buildTime: 60,
    energy: 10,
    description: "Increases tile capacity and provides storage",
    icon: "🏠",
  },
  {
    id: "barn",
    name: "Barn",
    type: "farm",
    cost: 150,
    buildTime: 90,
    energy: 15,
    description: "Stores crops and provides farming bonuses",
    icon: "🏚️",
  },
  {
    id: "workshop",
    name: "Workshop",
    type: "utility",
    cost: 200,
    buildTime: 120,
    energy: 20,
    description: "Craft tools and process materials",
    icon: "🔧",
  },
  {
    id: "market",
    name: "Market Stall",
    type: "trade",
    cost: 250,
    buildTime: 150,
    energy: 25,
    description: "Trade with NPCs and other players",
    icon: "🏪",
  },
  {
    id: "windmill",
    name: "Windmill",
    type: "utility",
    cost: 300,
    buildTime: 180,
    energy: 30,
    description: "Generates energy and processes grain",
    icon: "🌪️",
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    type: "farm",
    cost: 400,
    buildTime: 240,
    energy: 35,
    description: "Grow crops faster regardless of weather",
    icon: "🏡",
  },
]

export default function BuildMode() {
  const { gameState, updateResources } = useGame()

  const handleBuild = (building: (typeof buildings)[0]) => {
    if (gameState.resources.gold >= building.cost && gameState.resources.energy >= building.energy) {
      updateResources({
        gold: gameState.resources.gold - building.cost,
        energy: gameState.resources.energy - building.energy,
      })
      // Add building logic here
    }
  }

  const canAfford = (building: (typeof buildings)[0]) => {
    return gameState.resources.gold >= building.cost && gameState.resources.energy >= building.energy
  }

  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-20">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">🏗️ Build Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="farm">Farm</TabsTrigger>
                <TabsTrigger value="utility">Utility</TabsTrigger>
                <TabsTrigger value="trade">Trade</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buildings.map((building) => (
                    <Card
                      key={building.id}
                      className={`${canAfford(building) ? "border-green-300" : "border-gray-300"}`}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span className="text-2xl">{building.icon}</span>
                          {building.name}
                        </CardTitle>
                        <Badge variant="outline">{building.type}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600">{building.description}</p>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Coins className="w-4 h-4 text-yellow-500" />
                              Cost
                            </span>
                            <span className="font-medium">{building.cost} Gold</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-blue-500" />
                              Build Time
                            </span>
                            <span className="font-medium">{building.buildTime}s</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Zap className="w-4 h-4 text-green-500" />
                              Energy
                            </span>
                            <span className="font-medium">{building.energy}</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleBuild(building)}
                          disabled={!canAfford(building)}
                          className="w-full"
                        >
                          {canAfford(building) ? "Build" : "Insufficient Resources"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="farm" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buildings
                    .filter((b) => b.type === "farm")
                    .map((building) => (
                      <Card
                        key={building.id}
                        className={`${canAfford(building) ? "border-green-300" : "border-gray-300"}`}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-2xl">{building.icon}</span>
                            {building.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-gray-600">{building.description}</p>
                          <div className="flex justify-between text-sm">
                            <span>Cost: {building.cost} Gold</span>
                            <span>Energy: {building.energy}</span>
                          </div>
                          <Button
                            onClick={() => handleBuild(building)}
                            disabled={!canAfford(building)}
                            className="w-full"
                          >
                            Build
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="utility" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buildings
                    .filter((b) => b.type === "utility")
                    .map((building) => (
                      <Card
                        key={building.id}
                        className={`${canAfford(building) ? "border-green-300" : "border-gray-300"}`}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-2xl">{building.icon}</span>
                            {building.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-gray-600">{building.description}</p>
                          <div className="flex justify-between text-sm">
                            <span>Cost: {building.cost} Gold</span>
                            <span>Energy: {building.energy}</span>
                          </div>
                          <Button
                            onClick={() => handleBuild(building)}
                            disabled={!canAfford(building)}
                            className="w-full"
                          >
                            Build
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="trade" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buildings
                    .filter((b) => b.type === "trade")
                    .map((building) => (
                      <Card
                        key={building.id}
                        className={`${canAfford(building) ? "border-green-300" : "border-gray-300"}`}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-2xl">{building.icon}</span>
                            {building.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-gray-600">{building.description}</p>
                          <div className="flex justify-between text-sm">
                            <span>Cost: {building.cost} Gold</span>
                            <span>Energy: {building.energy}</span>
                          </div>
                          <Button
                            onClick={() => handleBuild(building)}
                            disabled={!canAfford(building)}
                            className="w-full"
                          >
                            Build
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
