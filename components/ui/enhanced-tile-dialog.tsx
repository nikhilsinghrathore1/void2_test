"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useGame } from "@/components/context/game-context"
import { Coins, X, ArrowRight, AlertCircle, Sparkles, Heart, Leaf } from "lucide-react"

interface EnhancedTileDialogProps {
  isOpen: boolean
  onClose: () => void
  type: "buy" | "sell" | "error"
  tileId: string
  errorMessage?: string
}

export default function EnhancedTileDialog({ isOpen, onClose, type, tileId, errorMessage }: EnhancedTileDialogProps) {
  const { gameState, updateGameTile, updateResources } = useGame()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [coinAnimation, setCoinAnimation] = useState(false)

  const tile = gameState.tiles.find((t) => t.id === tileId)

  // Prices
  const buyPrice = 20
  const sellPrice = Math.floor(buyPrice * 0.8)

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false)
      setIsSuccess(false)
      setShowConfetti(false)
      setCoinAnimation(false)
    }
  }, [isOpen])

  // Enhanced sound effects with gentle tones
  const playSound = (frequency: number, duration: number, volume = 0.1) => {
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

  const handleTransaction = () => {
    setIsProcessing(true)
    setCoinAnimation(true)

    // Gentle sound feedback
    if (type === "buy") {
      playSound(523, 0.3, 0.08) // Soft C5
      setTimeout(() => playSound(659, 0.3, 0.06), 150) // Gentle E5
    } else {
      playSound(440, 0.3, 0.08) // Soft A4
      setTimeout(() => playSound(554, 0.3, 0.06), 150) // Gentle C#5
    }

    setTimeout(() => {
      if (type === "buy") {
        updateResources({
          gold: gameState.resources.gold - buyPrice,
        })

        updateGameTile(tileId, {
          type: "land",
          owner: gameState.player.name,
        })

        // Success chime
        playSound(784, 0.4, 0.05)
      } else if (type === "sell") {
        updateResources({
          gold: gameState.resources.gold + sellPrice,
        })

        updateGameTile(tileId, {
          type: "empty",
          owner: null,
        })

        // Success chime
        playSound(698, 0.4, 0.05)
      }

      setIsProcessing(false)
      setIsSuccess(true)
      setShowConfetti(true)

      setTimeout(() => {
        onClose()
      }, 2500)
    }, 1200)
  }

  if (!isOpen) return null

  // Error dialog with soothing design
  if (type === "error") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="animate-float-up">
          <Card className="w-full max-w-md glass-card-transparent border-2 border-rose-200/30 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-rose-500" />
              </div>
              <CardTitle className="text-xl text-rose-600 font-semibold">Oops! Not enough gold</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 text-center">
              <div className="p-6 bg-gradient-to-br from-rose-50/60 to-rose-100/60 rounded-2xl border border-rose-200/30">
                <p className="text-rose-700 leading-relaxed">{errorMessage}</p>
              </div>

              <div className="space-y-3">
                <div className="text-6xl animate-bounce">💸</div>
                <p className="text-sage-600 font-medium">Visit the marketplace to earn more gold!</p>
                <p className="text-sage-500 text-sm">Plant and harvest crops to build your wealth</p>
              </div>
            </CardContent>

            <CardFooter className="pt-6">
              <Button onClick={onClose} className="w-full btn-primary">
                <Heart className="w-4 h-4 mr-2" />
                Got it!
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="animate-scale-in">
        <Card className="w-full max-w-lg glass-card-transparent border-2 border-sage-200/30 shadow-2xl relative overflow-hidden">
          {/* Gentle confetti effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-confetti-gentle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    backgroundColor: [
                      "rgb(79, 154, 126)", // sage
                      "rgb(139, 92, 246)", // lavender
                      "rgb(251, 191, 36)", // cream
                      "rgb(244, 63, 94)", // rose
                      "rgb(16, 185, 129)", // emerald
                    ][Math.floor(Math.random() * 5)],
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${4 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          )}

          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1" />
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  type === "buy"
                    ? "bg-gradient-to-br from-emerald-100 to-emerald-200"
                    : "bg-gradient-to-br from-lavender-100 to-lavender-200"
                }`}
              >
                {type === "buy" ? (
                  <Leaf className="h-8 w-8 text-emerald-600" />
                ) : (
                  <Coins className="h-8 w-8 text-lavender-600" />
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-sage-100">
                <X className="h-4 w-4 text-sage-500" />
              </Button>
            </div>
            <CardTitle className="text-2xl font-semibold text-sage-800">
              {type === "buy" ? "Claim Your Land" : "Release Your Land"}
            </CardTitle>
            <p className="text-sage-600 mt-2">
              {type === "buy"
                ? "Transform this space into your farming paradise"
                : "Return this land to nature and reclaim your investment"}
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Enhanced tile preview */}
            <div className="relative">
              <div className="flex items-center gap-6 p-8 bg-gradient-to-br from-sage-50/60 to-cream-50/60 rounded-3xl border-2 border-sage-100/30 shadow-inner">
                <div className="relative">
                  <div className="w-24 h-24 flex items-center justify-center bg-white rounded-2xl shadow-lg relative overflow-hidden">
                    <div
                      className={`w-20 h-20 rounded-xl ${
                        type === "buy"
                          ? "bg-gradient-to-br from-emerald-300 to-emerald-500"
                          : "bg-gradient-to-br from-cream-300 to-cream-500"
                      } ${coinAnimation ? "animate-coin-sparkle" : ""}`}
                    />
                    {coinAnimation && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    )}
                  </div>
                  {coinAnimation && (
                    <div className="absolute inset-0 bg-yellow-300/20 rounded-2xl animate-ripple-soft" />
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="font-bold text-xl text-sage-800">Tile {tileId}</h3>
                  <p className="text-sage-600 leading-relaxed">
                    {type === "buy"
                      ? "A perfect spot for growing crops and building your farming empire. Rich soil awaits your seeds!"
                      : "This land has served you well. Time to let it return to its natural state and reclaim your gold."}
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full animate-pulse ${
                        type === "buy" ? "bg-emerald-400" : "bg-lavender-400"
                      }`}
                    />
                    <span className="text-sm font-medium text-sage-700">
                      {type === "buy" ? "Ready for cultivation" : "Ready for release"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced price display */}
            <div className="relative">
              <div className="flex justify-between items-center p-8 bg-gradient-to-br from-cream-50/60 to-yellow-50/60 rounded-3xl border-2 border-cream-200/30 shadow-inner">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-cream-200 rounded-2xl flex items-center justify-center shadow-md">
                    <Coins className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-sage-700 text-lg">
                      {type === "buy" ? "Investment Required:" : "Gold Returned:"}
                    </span>
                    <div className="text-sm text-sage-500 mt-1">
                      {type === "buy" ? "One-time purchase" : "80% of original value"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-yellow-600 flex items-center gap-2">
                    {type === "buy" ? buyPrice : sellPrice}
                    <span className="text-xl font-medium">Gold</span>
                  </div>
                  {type === "sell" && <div className="text-sm text-sage-500 mt-1">Fair market value</div>}
                </div>
              </div>
              {coinAnimation && <div className="absolute inset-0 bg-yellow-300/10 rounded-3xl animate-ripple-soft" />}
            </div>

            {/* Success animation overlay */}
            {isSuccess && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-3xl animate-float-up">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 animate-bounce shadow-lg">
                      <Sparkles className="h-12 w-12 text-emerald-600" />
                    </div>
                    <div className="absolute inset-0 bg-emerald-300/20 rounded-full animate-ping" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-emerald-600">
                      {type === "buy" ? "Land Claimed!" : "Land Released!"}
                    </h3>
                    <p className="text-sage-600 font-medium">
                      {type === "buy" ? "Welcome to your new farming paradise!" : "Transaction completed with care!"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex gap-4 pt-8">
            <Button variant="outline" className="flex-1 btn-secondary" onClick={onClose} disabled={isProcessing}>
              Maybe Later
            </Button>
            <Button
              className={`flex-1 ${
                type === "buy" ? "btn-success" : "btn-primary"
              } ${isSuccess ? "animate-bounce" : ""}`}
              onClick={handleTransaction}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {type === "buy" ? "Claim Land" : "Release Land"}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
