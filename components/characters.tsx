"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box } from "@react-three/drei"

interface CharacterProps {
  position: [number, number, number]
  type?: "farmer" | "wizard" | "merchant" | "explorer"
  color?: string
  scale?: number
}

export function Character({ position, type = "farmer", color = "#ffb6c1", scale = 1 }: CharacterProps) {
  const characterRef = useRef<any>()
  const animationOffset = Math.random() * 10

  useFrame((state) => {
    if (characterRef.current) {
      const time = state.clock.getElapsedTime() + animationOffset

      // Idle animation - gentle bobbing and swaying
      characterRef.current.position.y = position[1] + Math.sin(time * 2) * 0.05
      characterRef.current.rotation.y = Math.sin(time * 0.5) * 0.3
    }
  })

  if (type === "farmer") {
    return (
      <group ref={characterRef} position={position} scale={scale}>
        {/* Body - voxel style */}
        <Box args={[0.6, 1.0, 0.4]} position={[0, 0.5, 0]} castShadow>
          <meshStandardMaterial color="#5f9ea0" />
        </Box>

        {/* Head */}
        <Box args={[0.4, 0.4, 0.4]} position={[0, 1.2, 0]} castShadow>
          <meshStandardMaterial color={color} />
        </Box>

        {/* Hat */}
        <Box args={[0.5, 0.2, 0.5]} position={[0, 1.5, 0]} castShadow>
          <meshStandardMaterial color="#8b4513" />
        </Box>

        {/* Arms */}
        <Box args={[0.2, 0.8, 0.2]} position={[0.4, 0.5, 0]} castShadow>
          <meshStandardMaterial color="#5f9ea0" />
        </Box>
        <Box args={[0.2, 0.8, 0.2]} position={[-0.4, 0.5, 0]} castShadow>
          <meshStandardMaterial color="#5f9ea0" />
        </Box>

        {/* Legs */}
        <Box args={[0.2, 0.8, 0.2]} position={[0.15, -0.4, 0]} castShadow>
          <meshStandardMaterial color="#4682b4" />
        </Box>
        <Box args={[0.2, 0.8, 0.2]} position={[-0.15, -0.4, 0]} castShadow>
          <meshStandardMaterial color="#4682b4" />
        </Box>
      </group>
    )
  }

  // Default character if type not recognized
  return (
    <group ref={characterRef} position={position} scale={scale}>
      <Box args={[0.6, 1.0, 0.4]} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#5f9ea0" />
      </Box>
      <Box args={[0.4, 0.4, 0.4]} position={[0, 1.2, 0]} castShadow>
        <meshStandardMaterial color={color} />
      </Box>
    </group>
  )
}

export function CharacterGroup({ position, count = 2 }: { position: [number, number, number]; count?: number }) {
  const types = ["farmer"] as const
  const skinColors = ["#ffb6c1", "#f5deb3", "#d2b48c"]

  return (
    <group position={position}>
      {Array.from({ length: count }).map((_, i) => {
        const offset: [number, number, number] = [(Math.random() - 0.5) * 3, 0, (Math.random() - 0.5) * 3]
        const scale = 0.8 + Math.random() * 0.4
        const type = types[0]
        const color = skinColors[Math.floor(Math.random() * skinColors.length)]

        return (
          <Character
            key={i}
            position={[position[0] + offset[0], position[1], position[2] + offset[2]]}
            scale={scale}
            type={type}
            color={color}
          />
        )
      })}
    </group>
  )
}
