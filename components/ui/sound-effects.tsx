"use client"

import { useEffect } from "react"

interface SoundEffectsProps {
  effect: "purchase" | "sale" | "error" | "success" | null
  onComplete?: () => void
}

export default function SoundEffects({ effect, onComplete }: SoundEffectsProps) {
  useEffect(() => {
    if (!effect) return

    // Create audio context for sound effects
    const playSound = (frequency: number, duration: number, type: OscillatorType = "sine") => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
        oscillator.type = type

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration)

        setTimeout(() => {
          audioContext.close()
          onComplete?.()
        }, duration * 1000)
      } catch (error) {
        // Fallback if audio context is not available
        onComplete?.()
      }
    }

    switch (effect) {
      case "purchase":
        // Happy purchase sound
        playSound(523, 0.2) // C5
        setTimeout(() => playSound(659, 0.2), 100) // E5
        setTimeout(() => playSound(784, 0.3), 200) // G5
        break
      case "sale":
        // Sale confirmation sound
        playSound(440, 0.2) // A4
        setTimeout(() => playSound(554, 0.3), 100) // C#5
        break
      case "error":
        // Error sound
        playSound(200, 0.5, "sawtooth")
        break
      case "success":
        // Success fanfare
        playSound(523, 0.1)
        setTimeout(() => playSound(659, 0.1), 50)
        setTimeout(() => playSound(784, 0.1), 100)
        setTimeout(() => playSound(1047, 0.3), 150)
        break
    }
  }, [effect, onComplete])

  return null
}
