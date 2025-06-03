"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box, Cone } from "@react-three/drei"

interface TreeProps {
  position: [number, number, number]
  scale?: number
  type?: "pine" | "oak" | "palm" | "fancy" | "voxel"
}

export function Tree({ position, scale = 1, type = "pine" }: TreeProps) {
  const treeRef = useRef<any>()

  useFrame((state) => {
    if (treeRef.current) {
      // Gentle dreamy swaying animation
      const time = state.clock.getElapsedTime()
      treeRef.current.rotation.z = Math.sin(time * 0.5 + position[0]) * 0.02
      // Add subtle floating effect
      treeRef.current.position.y = position[1] + Math.sin(time * 0.3 + position[2]) * 0.05
    }
  })

  if (type === "pine") {
    return (
      <group ref={treeRef} position={position} scale={scale} rotation={[0, Math.random() * Math.PI * 2, 0]}>
        {/* Pine trunk with rich dark color */}
        <Box args={[0.4, 3.2, 0.4]} position={[0, 1.6, 0]} castShadow>
          <meshStandardMaterial color="#A0522D" roughness={0.8} metalness={0.2} />
        </Box>

        {/* Pine foliage - vibrant dark forest greens with dreamy layers */}
        <Cone args={[1.8, 2.0]} position={[0, 4.2, 0]} castShadow>
          <meshStandardMaterial
            color="#228B22"
            roughness={0.6}
            metalness={0.1}
            emissive="#228B22"
            emissiveIntensity={0.08}
          />
        </Cone>
        <Cone args={[1.5, 1.8]} position={[0, 3.8, 0]} castShadow>
          <meshStandardMaterial
            color="#32CD32"
            roughness={0.6}
            metalness={0.1}
            emissive="#32CD32"
            emissiveIntensity={0.07}
          />
        </Cone>
        <Cone args={[1.2, 1.6]} position={[0, 3.4, 0]} castShadow>
          <meshStandardMaterial
            color="#78C850"
            roughness={0.6}
            metalness={0.1}
            emissive="#78C850"
            emissiveIntensity={0.06}
          />
        </Cone>
        <Cone args={[0.9, 1.4]} position={[0, 3.0, 0]} castShadow>
          <meshStandardMaterial
            color="#228B22"
            roughness={0.6}
            metalness={0.1}
            emissive="#228B22"
            emissiveIntensity={0.05}
          />
        </Cone>

        {/* Vibrant pine needles detail with enhanced glow */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Box
            key={i}
            args={[0.05, 0.3, 0.05]}
            position={[
              Math.cos((i * Math.PI * 2) / 8) * 1.0,
              2.8 + Math.random() * 0.4,
              Math.sin((i * Math.PI * 2) / 8) * 1.0,
            ]}
            castShadow
          >
            <meshStandardMaterial color="#1e5631" emissive="#1e5631" emissiveIntensity={0.1} />
          </Box>
        ))}
      </group>
    )
  }

  if (type === "oak") {
    return (
      <group ref={treeRef} position={position} scale={scale} rotation={[0, Math.random() * Math.PI * 2, 0]}>
        {/* Tree trunk with rich dark color */}
        <Box args={[0.5, 2.5, 0.5]} position={[0, 1.25, 0]} castShadow>
          <meshStandardMaterial color="#A0522D" roughness={0.8} metalness={0.2} />
        </Box>

        {/* Vibrant oak foliage with rich colors */}
        <Box args={[2.4, 1.2, 2.4]} position={[0, 3.0, 0]} castShadow>
          <meshStandardMaterial color="#78C850" roughness={0.6} emissive="#78C850" emissiveIntensity={0.08} />
        </Box>
        <Box args={[1.6, 1.0, 1.6]} position={[1.0, 3.5, 1.0]} castShadow>
          <meshStandardMaterial color="#32CD32" roughness={0.6} emissive="#32CD32" emissiveIntensity={0.07} />
        </Box>
        <Box args={[1.6, 1.0, 1.6]} position={[-1.0, 3.5, -1.0]} castShadow>
          <meshStandardMaterial color="#228B22" roughness={0.6} emissive="#228B22" emissiveIntensity={0.07} />
        </Box>
        <Box args={[1.2, 0.8, 1.2]} position={[0, 3.8, 0]} castShadow>
          <meshStandardMaterial color="#FF8C00" roughness={0.6} emissive="#FF8C00" emissiveIntensity={0.06} />
        </Box>
      </group>
    )
  }

  if (type === "palm") {
    return (
      <group ref={treeRef} position={position} scale={scale} rotation={[0, Math.random() * Math.PI * 2, 0]}>
        {/* Palm trunk - rich dark */}
        <Box args={[0.3, 2.0, 0.3]} position={[0, 1.0, 0]} castShadow>
          <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.2} />
        </Box>

        {/* Palm foliage - vibrant dark */}
        <Cone args={[2.0, 3.0]} position={[0, 3.5, 0]} castShadow>
          <meshStandardMaterial color="#006400" roughness={0.6} emissive="#006400" emissiveIntensity={0.08} />
        </Cone>
      </group>
    )
  }

  if (type === "fancy") {
    return (
      <group ref={treeRef} position={position} scale={scale} rotation={[0, Math.random() * Math.PI * 2, 0]}>
        {/* Magical trunk - rich dark */}
        <Box args={[0.3, 2.0, 0.3]} position={[0, 1.0, 0]} castShadow>
          <meshStandardMaterial
            color="#8b4513"
            roughness={0.7}
            metalness={0.3}
            emissive="#8b4513"
            emissiveIntensity={0.1}
          />
        </Box>

        {/* Vibrant dreamy magical foliage */}
        <Box args={[1.8, 0.6, 1.8]} position={[0, 2.3, 0]} castShadow>
          <meshStandardMaterial color="#2e8b57" roughness={0.5} emissive="#2e8b57" emissiveIntensity={0.1} />
        </Box>
        <Box args={[1.4, 0.6, 1.4]} position={[0, 2.8, 0]} castShadow>
          <meshStandardMaterial color="#1e5631" roughness={0.5} emissive="#1e5631" emissiveIntensity={0.08} />
        </Box>
        <Box args={[1.0, 0.6, 1.0]} position={[0, 3.3, 0]} castShadow>
          <meshStandardMaterial color="#006400" roughness={0.5} emissive="#006400" emissiveIntensity={0.07} />
        </Box>
      </group>
    )
  }

  // Default voxel tree with vibrant dark colors
  return (
    <group ref={treeRef} position={position} scale={scale} rotation={[0, Math.random() * Math.PI * 2, 0]}>
      <Box args={[0.4, 2.0, 0.4]} position={[0, 1.0, 0]} castShadow>
        <meshStandardMaterial color="#654321" roughness={0.8} metalness={0.2} />
      </Box>
      <Box args={[2.0, 1.2, 2.0]} position={[0, 2.6, 0]} castShadow>
        <meshStandardMaterial color="#1a3c28" roughness={0.6} emissive="#1a3c28" emissiveIntensity={0.06} />
      </Box>
    </group>
  )
}

export function TreeGroup({ position, count = 3 }: { position: [number, number, number]; count?: number }) {
  const types = ["pine", "oak", "palm", "fancy"] as const

  return (
    <group position={position}>
      {Array.from({ length: count }).map((_, i) => {
        const offset: [number, number, number] = [(Math.random() - 0.5) * 4, 0, (Math.random() - 0.5) * 4]
        const scale = 0.8 + Math.random() * 0.4
        const type = types[Math.floor(Math.random() * types.length)]
        const heightOffset = Math.random() * 0.5

        return (
          <Tree
            key={i}
            position={[position[0] + offset[0], position[1] + heightOffset, position[2] + offset[2]]}
            scale={scale}
            type={type}
          />
        )
      })}
    </group>
  )
}

// Enhanced Pine Forest with vibrant dark dreamy effects
export function PineForest({ position, count = 8 }: { position: [number, number, number]; count?: number }) {
  return (
    <group position={position}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const radius = 3 + Math.random() * 2
        const offset: [number, number, number] = [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
        const scale = 0.9 + Math.random() * 0.3
        const heightOffset = Math.random() * 0.5

        return (
          <Tree
            key={i}
            position={[position[0] + offset[0], position[1] + heightOffset, position[2] + offset[2]]}
            scale={scale}
            type="pine"
          />
        )
      })}
    </group>
  )
}
