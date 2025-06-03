"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface GameInstructionsProps {
  onClose: () => void
}

export default function GameInstructions({ onClose }: GameInstructionsProps) {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-30">
      <Card className="bg-white/95 backdrop-blur-sm max-w-2xl w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">How to Play Terron</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Getting Started</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-medium">1. Select a Tool</div>
                <p className="text-sm text-gray-600">
                  Use the tools panel on the left side of the screen to select what action you want to perform.
                </p>
              </div>
              <div className="space-y-2">
                <div className="font-medium">2. Interact with Tiles</div>
                <p className="text-sm text-gray-600">
                  Click on tiles in the 3D world to perform actions like buying land, planting crops, or harvesting.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Tools</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-medium">🛒 Buy/Sell Land</div>
                <p className="text-sm text-gray-600">
                  Select this tool and click on blue empty tiles to buy them for 20 gold. Click on owned land to sell it
                  back for 16 gold.
                </p>
              </div>
              <div className="space-y-2">
                <div className="font-medium">🌱 Plant Crops (Green)</div>
                <p className="text-sm text-gray-600">
                  Select this tool and click on brown land tiles to plant crops for 10 gold.
                </p>
              </div>
              <div className="space-y-2">
                <div className="font-medium">✂️ Harvest (Red)</div>
                <p className="text-sm text-gray-600">
                  Select this tool and click on fully grown crops (100%) to harvest them for gold.
                </p>
              </div>
              <div className="space-y-2">
                <div className="font-medium">🚶 Move (Gray)</div>
                <p className="text-sm text-gray-600">Click on tiles to select them and view information.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Land Management</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-medium">🟦 Empty Tiles</div>
                <p className="text-sm text-gray-600">
                  Blue tiles can be purchased for 20 gold. Click with the Buy tool selected to purchase.
                </p>
              </div>
              <div className="space-y-2">
                <div className="font-medium">🟫 Owned Land</div>
                <p className="text-sm text-gray-600">
                  Brown tiles are owned by you. You can plant crops on them or sell them back for 16 gold.
                </p>
              </div>
              <div className="space-y-2">
                <div className="font-medium">🟨 Golden Border</div>
                <p className="text-sm text-gray-600">
                  Tiles with a golden border are owned by you. This helps you identify your property.
                </p>
              </div>
              <div className="space-y-2">
                <div className="font-medium">💰 Land Value</div>
                <p className="text-sm text-gray-600">
                  Land can be sold back to the market at 80% of the purchase price. Expand strategically!
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Tips</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              <li>Crops take several minutes to grow - be patient and strategic!</li>
              <li>Harvest the same spot 3 times to grow a money tree that gives 100 gold per harvest!</li>
              <li>Buy land strategically to expand your farm in the most efficient way.</li>
              <li>You can sell land back if you need quick cash or want to reorganize your farm.</li>
              <li>Use fertilizer and water to speed up growth!</li>
            </ul>
          </div>

          <Button onClick={onClose} className="w-full">
            Start Playing
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
