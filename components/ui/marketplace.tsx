"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useGame } from "@/components/context/game-context"
import { Users, MessageCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

const marketItems = [
  { id: "1", name: "Wheat Bundle", type: "crop", price: 50, seller: "FarmBot", quantity: 10, icon: "🌾" },
  { id: "2", name: "Corn Seeds", type: "seed", price: 30, seller: "SeedMaster", quantity: 5, icon: "🌽" },
  { id: "3", name: "Fertilizer Pack", type: "booster", price: 100, seller: "GrowFast", quantity: 3, icon: "💧" },
  { id: "4", name: "Land Tile", type: "land", price: 200, seller: "LandLord", quantity: 1, icon: "🟫" },
  { id: "5", name: "Magic Beans", type: "rare", price: 500, seller: "Wizard", quantity: 2, icon: "✨" },
]

const playerOffers = [
  { id: "1", player: "SkyFarmer", wants: "Wheat x10", offers: "Corn x15", status: "pending" },
  { id: "2", player: "CloudGrower", wants: "Fertilizer x2", offers: "50 Gold", status: "active" },
  { id: "3", player: "FloatMaster", wants: "Land Tile", offers: "Magic Beans x1", status: "completed" },
]

export default function Marketplace() {
  const { gameState, updateResources, addToInventory } = useGame()
  const [purchaseMessage, setPurchaseMessage] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const buyItem = (item: (typeof marketItems)[0]) => {
    if (gameState.resources.gold >= item.price) {
      updateResources({
        gold: gameState.resources.gold - item.price,
      })

      // Add item to inventory
      addToInventory({
        id: `purchased-${Date.now()}`,
        name: item.name,
        type: item.type === "seed" ? "crop" : (item.type as any),
        quantity: 1,
        rarity: item.type === "rare" ? "rare" : "common",
      })

      // Show success message
      setPurchaseMessage({
        message: `Successfully purchased ${item.name}!`,
        type: "success",
      })

      // Clear message after 3 seconds
      setTimeout(() => setPurchaseMessage(null), 3000)
    } else {
      // Show error message
      setPurchaseMessage({
        message: "Not enough gold to make this purchase!",
        type: "error",
      })

      // Clear message after 3 seconds
      setTimeout(() => setPurchaseMessage(null), 3000)
    }
  }

  const canAfford = (item: (typeof marketItems)[0]) => {
    return gameState.resources.gold >= item.price
  }

  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-20">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              🏪 Marketplace
            </CardTitle>

            {/* Purchase message */}
            {purchaseMessage && (
              <div
                className={`mt-2 p-2 rounded text-center ${
                  purchaseMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {purchaseMessage.type === "error" && <AlertCircle className="w-4 h-4" />}
                  {purchaseMessage.message}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="buy" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="sell">Sell</TabsTrigger>
                <TabsTrigger value="trade">P2P Trade</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="buy" className="mt-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input placeholder="Search items..." className="flex-1" />
                    <Button variant="outline">Filter</Button>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {marketItems.map((item) => (
                      <Card key={item.id} className={`${canAfford(item) ? "border-green-300" : "border-gray-300"}`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-2xl">{item.icon}</span>
                            {item.name}
                          </CardTitle>
                          <Badge variant="outline">{item.type}</Badge>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Seller: {item.seller}</span>
                            <span>Qty: {item.quantity}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">{item.price} Gold</span>
                            <Button onClick={() => buyItem(item)} disabled={!canAfford(item)} size="sm">
                              {canAfford(item) ? "Buy" : "Can't Afford"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sell" className="mt-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Inventory</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gameState.inventory.map((item) => (
                          <Card key={item.id} className="bg-blue-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{item.name}</span>
                                <Badge>{item.quantity}</Badge>
                              </div>
                              <div className="flex gap-2">
                                <Input placeholder="Price" size={10} />
                                <Button size="sm">List</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trade" className="mt-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Player-to-Player Trades
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {playerOffers.map((offer) => (
                          <Card key={offer.id} className="bg-purple-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{offer.player}</div>
                                  <div className="text-sm text-gray-600">
                                    Wants: {offer.wants} → Offers: {offer.offers}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      offer.status === "active"
                                        ? "default"
                                        : offer.status === "completed"
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {offer.status}
                                  </Badge>
                                  {offer.status === "active" && <Button size="sm">Accept</Button>}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Create Trade Offer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">I Want:</label>
                          <Input placeholder="e.g., Wheat x10" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">I Offer:</label>
                          <Input placeholder="e.g., Corn x15" />
                        </div>
                      </div>
                      <Button className="w-full">Create Trade Offer</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Trade Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-64 bg-gray-50 rounded p-4 overflow-y-auto">
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium text-blue-600">SkyFarmer:</span> Looking for wheat seeds!
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-green-600">CloudGrower:</span> I have some, what do you
                            offer?
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-purple-600">FloatMaster:</span> Anyone selling land tiles?
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Type your message..." className="flex-1" />
                        <Button>Send</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
