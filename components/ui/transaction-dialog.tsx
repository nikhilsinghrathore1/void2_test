"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Modal from "@/components/ui/modal"
import { useGame } from "@/components/context/game-context"
import { Sparkles } from "lucide-react"

interface TransactionDialogProps {
  isOpen: boolean
  onClose: () => void
  type: "buy" | "sell"
  item: {
    id: string
    name: string
    price: number
    icon?: string
    image?: string
    description?: string
    maxQuantity?: number
  }
}

export default function TransactionDialog({ isOpen, onClose, type, item }: TransactionDialogProps) {
  const { gameState, updateResources, addToInventory } = useGame()
  const [quantity, setQuantity] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const totalPrice = item.price * quantity

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, item.maxQuantity || 99))
    setQuantity(newQuantity)
  }

  const handleTransaction = () => {
    if (type === "buy") {
      if (gameState.resources.gold >= totalPrice) {
        updateResources({
          gold: gameState.resources.gold - totalPrice,
        })
        addToInventory({
          id: `${item.id}-${Date.now()}`,
          name: item.name,
          type: "crop",
          quantity: quantity,
          rarity: "common",
        })
        setIsSuccess(true)
        setTimeout(() => {
          setIsSuccess(false)
          onClose()
        }, 1500)
      } else {
        setError("Not enough gold!")
        setTimeout(() => setError(""), 2000)
      }
    } else if (type === "sell") {
      // Implement sell logic
      updateResources({
        gold: gameState.resources.gold + totalPrice,
      })
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 1500)
    }
  }

  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
      setIsSuccess(false)
      setError("")
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === "buy" ? "Buy Item" : "Sell Item"}
      className="max-w-sm w-full"
    >
      <div className="space-y-4">
        {/* Item preview */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg shadow-sm text-4xl">
            {item.icon || "🌱"}
          </div>
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description || "No description available."}</p>
          </div>
        </div>

        {/* Quantity selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity:</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity - 1)}
            >
              -
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
              className="h-8 text-center"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Total Price:</span>
          <span className="text-lg font-bold text-amber-600">{totalPrice} Gold</span>
        </div>

        {/* Error message */}
        {error && <div className="text-center text-red-500 font-medium">{error}</div>}

        {/* Success animation */}
        {isSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <Sparkles className="h-8 w-8 text-green-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-green-600">
                {type === "buy" ? "Purchase Complete!" : "Sale Complete!"}
              </h3>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className={`flex-1 ${
              isSuccess ? "animate-bounce bg-green-600" : ""
            } transition-all duration-300 ease-in-out`}
            onClick={handleTransaction}
          >
            {type === "buy" ? "Confirm Purchase" : "Confirm Sale"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
