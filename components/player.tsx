"use client"

import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Box } from "@react-three/drei"

interface PlayerProps {
  position: [number, number, number]
  setPosition: (position: [number, number, number]) => void
}

export default function Player({ position, setPosition }: PlayerProps) {
  const meshRef = useRef<any>()
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key in keys || e.key.startsWith("Arrow")) {
        e.preventDefault()
        setKeys((prev) => ({ ...prev, [e.key]: true, [key]: true }))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key in keys || e.key.startsWith("Arrow")) {
        e.preventDefault()
        setKeys((prev) => ({ ...prev, [e.key]: false, [key]: false }))
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("keyup", handleKeyUp)
      }
    }
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current || !position) return

    const speed = 3
    let newX = position[0]
    let newZ = position[2]

    // Update movement based on keys
    if (keys.w || keys.ArrowUp) newZ -= speed * delta
    if (keys.s || keys.ArrowDown) newZ += speed * delta
    if (keys.a || keys.ArrowLeft) newX -= speed * delta
    if (keys.d || keys.ArrowRight) newX += speed * delta

    // Keep player within bounds
    newX = Math.max(-8, Math.min(8, newX))
    newZ = Math.max(-8, Math.min(8, newZ))

    const newPosition: [number, number, number] = [newX, 0.5, newZ]

    if (newX !== position[0] || newZ !== position[2]) {
      setPosition(newPosition)
    }

    meshRef.current.position.set(newPosition[0], newPosition[1], newPosition[2])
  })

  return (
    <Box ref={meshRef} args={[0.3, 0.6, 0.3]} position={position} castShadow>
      <meshStandardMaterial color="#FF6B6B" />
    </Box>
  )
}
