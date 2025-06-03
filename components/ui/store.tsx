"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGame } from "@/components/context/game-context"
import { Gem, Package, Gift } from "lucide-react"

const gemPacks = [
  { id: "small", name: "Small Gem Pack", gems: 100, price: "$0.99", bonus: "", popular: false },
  { id: "medium", name: "Medium Gem Pack", gems: 500, price: "$4.99", bonus: "+50 Bonus", popular: true },
  { id: "large", name: "Large Gem Pack", gems: 1200, price: "$9.99", bonus: "+200 Bonus", popular: false },
  { id: "mega", name: "Mega Gem Pack", gems: 2500, price: "$19.99", bonus: "+500 Bonus", popular: false },
]

const skins = [
  { id: "desert", name: "Desert Theme", price: 50, preview: "🏜️", description: "Sandy tiles with cacti" },
  { id: "snow", name: "Snow Theme", price: 75, preview: "❄️", description: "Icy tiles with snowflakes" },
  { id: "volcano", name: "Volcano Theme", price: 100, preview: "🌋", description: "Lava tiles with fire effects" },
  { id: "ocean", name: "Ocean Theme", price: 125, preview: "🌊", description: "Water tiles with coral" },
]

const tilePacks = [
  { id: "starter", name: "Starter Pack", tiles: 5, price: 25, type: "Basic land tiles" },
  { id: "premium", name: "Premium Pack", tiles: 10, price: 75, type: "Enhanced fertile tiles" },
  { id: "rare", name: "Rare Pack", tiles: 3, price: 100, type: "Special mineral tiles" },
  { id: "legendary", name: "Legendary Pack", tiles: 1, price: 200, type: "Magical floating island" },
]

const mysteryBoxes = [
  { id: "bronze", name: "Bronze Box", price: 10, contents: "Random seeds & tools", rarity: "Common" },
  { id: "silver", name: "Silver Box", price: 25, contents: "Rare crops & boosters", rarity: "Rare" },
  { id: "gold", name: "Gold Box", price: 50, contents: "Epic items & gems", rarity: "Epic" },
  { id: "diamond", name: "Diamond Box", price: 100, contents: "Legendary rewards", rarity: "Legendary" },
]

export default function Store() {
  const { gameState, updateResources } = useGame()

  const buyGems = (pack: (typeof gemPacks)[0]) => {
    // In a real app, this would integrate with payment processing
    console.log(`Purchasing ${pack.name} for ${pack.price}`)
  }

  const buySkin = (skin: (typeof skins)[0]) => {
    if (gameState.resources.gems >= skin.price) {
      updateResources({
        gems: gameState.resources.gems - skin.price,
      })
    }
  }

  const buyTilePack = (pack: (typeof tilePacks)[0]) => {
    if (gameState.resources.gems >= pack.price) {
      updateResources({
        gems: gameState.resources.gems - pack.price,
      })
    }
  }

  const buyMysteryBox = (box: (typeof mysteryBoxes)[0]) => {
    if (gameState.resources.gems >= box.price) {
      updateResources({
        gems: gameState.resources.gems - box.price,
      })
    }
  }

  const canAffordGems = (price: number) => gameState.resources.gems >= price

  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-20">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              💎 Terron Store
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="gems" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="gems">💎 Gems</TabsTrigger>
                <TabsTrigger value="skins">🎨 Skins</TabsTrigger>
                <TabsTrigger value="tiles">🧩 Tiles</TabsTrigger>
                <TabsTrigger value="boxes">📦 Boxes</TabsTrigger>
              </TabsList>

              <TabsContent value="gems" className="mt-6">
                <div className="space-y-4">
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-medium mb-2">Current Balance</div>
                      <div className="text-3xl font-bold text-blue-600 flex items-center justify-center gap-2">
                        <Gem className="w-8 h-8" />
                        {gameState.resources.gems} Gems
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-4">
                    {gemPacks.map((pack) => (
                      <Card key={pack.id} className={`${pack.popular ? "border-yellow-400 border-2" : ""} relative`}>
                        {pack.popular && (
                          <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500">
                            Most Popular
                          </Badge>
                        )}
                        <CardHeader className="text-center">
                          <CardTitle className="flex items-center justify-center gap-2">
                            <Gem className="w-6 h-6 text-blue-500" />
                            {pack.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                          <div>
                            <div className="text-3xl font-bold text-blue-600">{pack.gems}</div>
                            <div className="text-sm text-gray-600">Gems</div>
                            {pack.bonus && <div className="text-sm text-green-600 font-medium">{pack.bonus}</div>}
                          </div>
                          <div className="text-2xl font-bold">{pack.price}</div>
                          <Button onClick={() => buyGems(pack)} className="w-full">
                            Purchase
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="skins" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {skins.map((skin) => (
                    <Card
                      key={skin.id}
                      className={`${canAffordGems(skin.price) ? "border-green-300" : "border-gray-300"}`}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-2xl">{skin.preview}</span>
                          {skin.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600">{skin.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Gem className="w-4 h-4 text-blue-500" />
                            <span className="font-bold">{skin.price} Gems</span>
                          </div>
                          <Button onClick={() => buySkin(skin)} disabled={!canAffordGems(skin.price)} size="sm">
                            {canAffordGems(skin.price) ? "Buy" : "Not Enough Gems"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tiles" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {tilePacks.map((pack) => (
                    <Card
                      key={pack.id}
                      className={`${canAffordGems(pack.price) ? "border-green-300" : "border-gray-300"}`}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          {pack.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="text-2xl font-bold">{pack.tiles} Tiles</div>
                          <div className="text-sm text-gray-600">{pack.type}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Gem className="w-4 h-4 text-blue-500" />
                            <span className="font-bold">{pack.price} Gems</span>
                          </div>
                          <Button onClick={() => buyTilePack(pack)} disabled={!canAffordGems(pack.price)} size="sm">
                            {canAffordGems(pack.price) ? "Buy" : "Not Enough Gems"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="boxes" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {mysteryBoxes.map((box) => (
                    <Card
                      key={box.id}
                      className={`${canAffordGems(box.price) ? "border-green-300" : "border-gray-300"}`}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Gift className="w-5 h-5" />
                          {box.name}
                        </CardTitle>
                        <Badge variant="outline">{box.rarity}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600">{box.contents}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Gem className="w-4 h-4 text-blue-500" />
                            <span className="font-bold">{box.price} Gems</span>
                          </div>
                          <Button onClick={() => buyMysteryBox(box)} disabled={!canAffordGems(box.price)} size="sm">
                            {canAffordGems(box.price) ? "Open" : "Not Enough Gems"}
                          </Button>
                        </div>
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
