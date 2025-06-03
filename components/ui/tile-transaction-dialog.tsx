"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useGame } from "@/components/context/game-context"
import { Coins, X, Check, ArrowRight } from "lucide-react"

interface TileTransactionDialogProps {
  isOpen: boolean
  onClose: () => void
  type: "buy" | "sell"
  tileId: string
}

export default function TileTransactionDialog({ isOpen, onClose, type, tileId }: TileTransactionDialogProps) {
  const { gameState, updateGameTile, updateResources } = useGame()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const tile = gameState.tiles.find((t) => t.id === tileId)

  // Prices
  const buyPrice = 20 // Base price to buy a tile
  const sellPrice = Math.floor(buyPrice * 0.8) // 80% of buy price when selling

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false)
      setIsSuccess(false)
      setError("")
    }
  }, [isOpen])

  if (!isOpen || !tile) return null

  const handleTransaction = () => {
    setIsProcessing(true)

    setTimeout(() => {
      if (type === "buy") {
        // Check if player has enough gold
        if (gameState.resources.gold >= buyPrice) {
          // Update player's gold
          updateResources({
            gold: gameState.resources.gold - buyPrice,
          })

          // Update tile ownership
          updateGameTile(tileId, {
            type: "land",
            owner: gameState.player.name,
          })

          setIsSuccess(true)
          setTimeout(() => {
            onClose()
          }, 1500)
        } else {
          setError("Not enough gold!")
          setIsProcessing(false)
        }
      } else if (type === "sell") {
        // Update player's gold
        updateResources({
          gold: gameState.resources.gold + sellPrice,
        })

        // Update tile ownership
        updateGameTile(tileId, {
          type: "empty",
          owner: null,
        })

        setIsSuccess(true)
        setTimeout(() => {
          onClose()
        }, 1500)
      }
    }, 800) // Simulate processing time
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md border-2 border-gray-200 shadow-xl animate-in fade-in zoom-in-95 duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">{type === "buy" ? "Buy Land Tile" : "Sell Land Tile"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tile preview */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg shadow-sm">
              <div className={`w-12 h-12 rounded ${type === "buy" ? "bg-blue-400" : "bg-amber-600"}`}></div>
            </div>
            <div>
              <h3 className="font-medium">Tile {tileId}</h3>
              <p className="text-sm text-gray-600">
                {type === "buy" ? "Purchase this land to start farming!" : "Sell this land back to the market."}
              </p>
            </div>
          </div>

          {/* Price display */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">{type === "buy" ? "Purchase Price:" : "Sell Value:"}</span>
            </div>
            <span className="text-xl font-bold text-amber-600">{type === "buy" ? buyPrice : sellPrice} Gold</span>
          </div>

          {/* Error message */}
          {error && <div className="p-2 bg-red-100 text-red-700 rounded-md text-center">{error}</div>}

          {/* Success animation */}
          {isSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg animate-in fade-in zoom-in duration-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-600">
                  {type === "buy" ? "Land Purchased!" : "Land Sold!"}
                </h3>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleTransaction} disabled={isProcessing}>
            {isProcessing ? (
              <span className="flex items-center gap-2">
                Processing <span className="animate-pulse">...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {type === "buy" ? "Buy Land" : "Sell Land"} <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
