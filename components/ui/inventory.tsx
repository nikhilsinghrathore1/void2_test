"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGame } from "@/components/context/game-context"
import { Package } from "lucide-react"

export default function Inventory() {
  const { gameState } = useGame()

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "crop":
        return "🌾"
      case "tool":
        return "🔧"
      case "booster":
        return "⚡"
      case "building":
        return "🏠"
      default:
        return "📦"
    }
  }

  const filterByType = (type: string) => {
    return gameState.inventory.filter((item) => item.type === type)
  }

  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-20">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">🎒 Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="crop">Crops</TabsTrigger>
                <TabsTrigger value="tool">Tools</TabsTrigger>
                <TabsTrigger value="booster">Boosters</TabsTrigger>
                <TabsTrigger value="building">Buildings</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {gameState.inventory.map((item) => (
                    <Card key={item.id} className={`${getRarityColor(item.rarity)} relative`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{getTypeIcon(item.type)}</span>
                          <Badge className="absolute top-2 right-2">{item.quantity}</Badge>
                        </div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                          <Badge className={`text-xs ${getRarityColor(item.rarity)}`}>{item.rarity}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Use
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Sell
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="crop" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filterByType("crop").map((item) => (
                    <Card key={item.id} className={`${getRarityColor(item.rarity)} relative`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{getTypeIcon(item.type)}</span>
                          <Badge className="absolute top-2 right-2">{item.quantity}</Badge>
                        </div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge className={`text-xs ${getRarityColor(item.rarity)}`}>{item.rarity}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Plant
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Sell
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tool" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filterByType("tool").map((item) => (
                    <Card key={item.id} className={`${getRarityColor(item.rarity)} relative`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{getTypeIcon(item.type)}</span>
                          <Badge className="absolute top-2 right-2">{item.quantity}</Badge>
                        </div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge className={`text-xs ${getRarityColor(item.rarity)}`}>{item.rarity}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Equip
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Sell
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="booster" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filterByType("booster").map((item) => (
                    <Card key={item.id} className={`${getRarityColor(item.rarity)} relative`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{getTypeIcon(item.type)}</span>
                          <Badge className="absolute top-2 right-2">{item.quantity}</Badge>
                        </div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge className={`text-xs ${getRarityColor(item.rarity)}`}>{item.rarity}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Use
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Sell
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="building" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filterByType("building").map((item) => (
                    <Card key={item.id} className={`${getRarityColor(item.rarity)} relative`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{getTypeIcon(item.type)}</span>
                          <Badge className="absolute top-2 right-2">{item.quantity}</Badge>
                        </div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge className={`text-xs ${getRarityColor(item.rarity)}`}>{item.rarity}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Place
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Sell
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Inventory Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Inventory Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{gameState.inventory.length}</div>
                    <div className="text-sm text-gray-600">Total Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {gameState.inventory.reduce((sum, item) => sum + item.quantity, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Quantity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {
                        gameState.inventory.filter(
                          (item) => item.rarity === "rare" || item.rarity === "epic" || item.rarity === "legendary",
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Rare Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {gameState.inventory.filter((item) => item.type === "crop").length}
                    </div>
                    <div className="text-sm text-gray-600">Crop Types</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
