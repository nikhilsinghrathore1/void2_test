"use client"

import { useEffect, useState } from "react"

interface TileVisualEffectsProps {
  tileId: string
  effect: "purchase" | "sale" | "glow" | null
  position: [number, number, number]
  onEffectComplete?: () => void
}

export default function TileVisualEffects({ tileId, effect, position, onEffectComplete }: TileVisualEffectsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (effect) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onEffectComplete?.()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [effect, onEffectComplete])

  if (!effect || !isVisible) return null

  const getEffectColor = () => {
    switch (effect) {
      case "purchase":
        return "from-green-400 to-green-600"
      case "sale":
        return "from-blue-400 to-blue-600"
      case "glow":
        return "from-yellow-400 to-yellow-600"
      default:
        return "from-white to-gray-200"
    }
  }

  const getEffectIcon = () => {
    switch (effect) {
      case "purchase":
        return "🏠"
      case "sale":
        return "💰"
      case "glow":
        return "✨"
      default:
        return "⭐"
    }
  }

  return (
    <div
      className="fixed pointer-events-none z-40"
      style={{
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Main effect container */}
      <div className="relative">
        {/* Ripple effect */}
        <div
          className={`absolute inset-0 w-32 h-32 bg-gradient-to-r ${getEffectColor()} rounded-full opacity-20 animate-ping`}
        />
        <div
          className={`absolute inset-2 w-28 h-28 bg-gradient-to-r ${getEffectColor()} rounded-full opacity-30 animate-ping`}
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className={`absolute inset-4 w-24 h-24 bg-gradient-to-r ${getEffectColor()} rounded-full opacity-40 animate-ping`}
          style={{ animationDelay: "0.4s" }}
        />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl animate-bounce">{getEffectIcon()}</div>
        </div>

        {/* Floating particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
            style={{
              left: `${50 + Math.cos((i * Math.PI * 2) / 8) * 60}%`,
              top: `${50 + Math.sin((i * Math.PI * 2) / 8) * 60}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
