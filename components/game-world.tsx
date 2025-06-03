"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Box, Cylinder, Plane, Sky, useGLTF } from "@react-three/drei"
import { Tree } from "@/components/trees"
import { useGame } from "@/components/context/game-context"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GroupProps } from '@react-three/fiber'

interface Tile {
  id: string
  position: [number, number, number]
  type: "empty" | "land" | "crop" | "money-tree" | "water" | "tree"
  growth: number
  harvestCount: number
  owner?: string | null
  price?: number
  treeType?: "pine" | "oak" | "palm" | "fancy"
}

interface GameWorldProps {
  tiles: Tile[]
  onTileClick: (tileId: string) => void
  selectedTool: string
  onPlantInteraction?: (tileId: string, screenPosition: { x: number; y: number }) => void
  onTileTransaction?: (tileId: string, type: "buy" | "sell") => void
}

function GroundPlane() {
  return (
    <group>
      {/* Main vibrant grass ground with rich dark green */}
      <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <meshStandardMaterial
          color="#78C850"
          roughness={0.8}
          metalness={0.1}
          emissive="#78C850"
          emissiveIntensity={0.08}
        />
      </Plane>

      {/* Enhanced dirt patches with rich warm soil */}
      <Box args={[12, 0.05, 12]} position={[0, -0.05, 0]} receiveShadow>
        <meshStandardMaterial
          color="#A0522D"
          roughness={0.9}
          metalness={0.1}
          emissive="#A0522D"
          emissiveIntensity={0.05}
        />
      </Box>

      {/* Vibrant meadow grass patches */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Box
          key={i}
          args={[0.4, 0.15, 0.4]}
          position={[(Math.random() - 0.5) * 40, 0, (Math.random() - 0.5) * 40]}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial color="#3cb371" roughness={0.7} emissive="#3cb371" emissiveIntensity={0.12} />
        </Box>
      ))}

      {/* Enhanced wooden fence with rich dark trunk color */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2
        const radius = 7
        return (
          <Box
            key={i}
            args={[0.1, 0.8, 0.1]}
            position={[Math.cos(angle) * radius, 0.4, Math.sin(angle) * radius]}
            castShadow
          >
            <meshStandardMaterial color="#654321" roughness={0.8} metalness={0.2} />
          </Box>
        )
      })}

      {/* Vibrant crystal stone path */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Cylinder
          key={i}
          args={[0.3, 0.3, 0.1]}
          position={[i * 1.5 - 8, 0.05, 0]}
          rotation={[0, Math.random() * Math.PI, 0]}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial
            color="#e0e7ff"
            roughness={0.3}
            metalness={0.3}
            emissive="#e0e7ff"
            emissiveIntensity={0.12}
          />
        </Cylinder>
      ))}

      {/* Magical water features with vibrant crystal blue */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Cylinder
          key={i}
          args={[0.8, 0.8, 0.05]}
          position={[(Math.random() - 0.5) * 30, 0.02, (Math.random() - 0.5) * 30]}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial
            color="#1e90ff"
            roughness={0.1}
            metalness={0.4}
            emissive="#1e90ff"
            emissiveIntensity={0.25}
            transparent
            opacity={0.85}
          />
        </Cylinder>
      ))}

      {/* Additional lush grass tufts */}
      {Array.from({ length: 40 }).map((_, i) => (
        <Box
          key={i}
          args={[0.2, 0.3, 0.2]}
          position={[(Math.random() - 0.5) * 45, 0.15, (Math.random() - 0.5) * 45]}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial color="#1e5631" roughness={0.7} emissive="#1e5631" emissiveIntensity={0.1} />
        </Box>
      ))}
    </group>
  )
}

function GameTile({
  tile,
  onClick,
  selectedTool,
  onPlantInteraction,
  onTileTransaction,
}: {
  tile: Tile
  onClick: () => void
  selectedTool: string
  onPlantInteraction?: (tileId: string, screenPosition: { x: number; y: number }) => void
  onTileTransaction?: (tileId: string, type: "buy" | "sell") => void
}) {
  const meshRef = useRef<any>()
  const { gameState } = useGame()
  const [hovered, setHovered] = useState(false)
  const [growthStage, setGrowthStage] = useState(0)
  const [plantScale, setPlantScale] = useState(0.3)
  const [showBuyIndicator, setShowBuyIndicator] = useState(false)
  const [showSellIndicator, setShowSellIndicator] = useState(false)
  const [showTreeIndicator, setShowTreeIndicator] = useState(false)
  const [tileEffect, setTileEffect] = useState<"purchase" | "sale" | "glow" | null>(null)
  const [glowIntensity, setGlowIntensity] = useState(0)
  const [bounce, setBounce] = useState(false)

  // Handle growth stages
  useEffect(() => {
    if (tile.type === "crop") {
      if (tile.growth < 30) {
        setGrowthStage(0) // Sprout
      } else if (tile.growth < 70) {
        setGrowthStage(1) // Mid growth
      } else {
        setGrowthStage(2) // Fully grown
      }

      // Animate plant scale based on growth
      const targetScale = 0.3 + (tile.growth / 100) * 0.7
      setPlantScale(targetScale)
    }
  }, [tile.type, tile.growth])

  // Show buy/sell/tree indicators based on hover and tool
  useEffect(() => {
    if (hovered) {
      if (selectedTool === "buy" && tile.type === "empty") {
        setShowBuyIndicator(true)
      } else if (selectedTool === "buy" && tile.type !== "empty" && tile.owner === gameState.player.name) {
        setShowSellIndicator(true)
      } else if (selectedTool === "tree" && tile.type === "land") {
        setShowTreeIndicator(true)
      }
      setGlowIntensity(0.15)
    } else {
      setShowBuyIndicator(false)
      setShowSellIndicator(false)
      setShowTreeIndicator(false)
      setGlowIntensity(0)
    }
  }, [hovered, selectedTool, tile.type, tile.owner, gameState.player.name])

  useFrame((state) => {
    if (meshRef.current && tile.position) {
      // Dreamy floating animation for crops and trees
      if (tile.type === "crop" || tile.type === "money-tree" || tile.type === "tree") {
        meshRef.current.position.y = tile.position[1] + Math.sin(state.clock.elapsedTime * 2 + tile.position[0]) * 0.03
      }
      // Water ripple effect
      if (tile.type === "water") {
        meshRef.current.position.y =
          tile.position[1] + Math.sin(state.clock.elapsedTime * 3 + tile.position[0] * 2) * 0.02
      }

      if (bounce) {
        meshRef.current.position.y = tile.position[1] + Math.abs(Math.sin(state.clock.elapsedTime * 5)) * 0.2
      }
    }
  })

  const getTileColor = () => {
    if (tile.price) {
      if (tile.price < 50) {
        return "#90EE90" // LightGreen
      } else if (tile.price < 100) {
        return "#FFFFE0" // LightYellow
      } else if (tile.price < 200) {
        return "#FFA500" // Orange
      } else {
        return "#DC143C" // Crimson
      }
    }

    switch (tile.type) {
      case "empty":
        return "#b2e0ff" // Sky light blue
      case "land":
        return "#c19a70" // Rich warm soil
      case "crop":
        return tile.growth >= 100 ? "#ffd700" : "#3cb371" // Vibrant harvest gold or lush green
      case "money-tree":
        return "#c19a70" // Rich soil base
      case "water":
        return "#1e90ff" // Vibrant crystal blue water
      case "tree":
        return "#2e8b57" // Forest green for tree tiles
      default:
        return "#b2e0ff"
    }
  }

  const getHoverColor = () => {
    switch (selectedTool) {
      case "buy":
        if (tile.type === "empty") return "#ffd700" // Vibrant gold for buying
        if (tile.owner === gameState.player.name) return "#ff69b4" // Vibrant pink for selling
        return getTileColor()
      case "plant":
        return tile.type === "land" ? "#2e8b57" : getTileColor() // Vibrant green for planting
      case "tree":
        return tile.type === "land" ? "#228b22" : getTileColor() // Forest green for tree planting
      case "harvest":
        return (tile.type === "crop" && tile.growth >= 100) || tile.type === "money-tree" ? "#ff1493" : getTileColor() // Vibrant pink for harvesting
      default:
        return getTileColor()
    }
  }

  const handleClick = (event: any) => {
    onClick()

    // Handle buy/sell transactions
    if (selectedTool === "buy" && onTileTransaction) {
      if (tile.type === "empty") {
        setTileEffect("purchase")
        setBounce(true)
        setTimeout(() => {
          setTileEffect(null)
          setBounce(false)
        }, 2000)
        onTileTransaction(tile.id, "buy")
      } else if (tile.owner === gameState.player.name && tile.type === "land") {
        setTileEffect("sale")
        setBounce(true)
        setTimeout(() => {
          setTileEffect(null)
          setBounce(false)
        }, 2000)
        onTileTransaction(tile.id, "sell")
      }
    }

    // If it's a crop, show plant interaction menu
    if (tile.type === "crop" && onPlantInteraction) {
      onPlantInteraction(tile.id, { x: event.clientX || 400, y: event.clientY || 300 })
    }
  }

  if (!tile.position) return null

  return (
    <group ref={meshRef} position={tile.position}>
      {/* Base tile with vibrant colors */}
      <Box
        args={[1.8, 0.1, 1.8]}
        onClick={handleClick}
        onPointerOver={(e) => {
          if (e.object.material) {
            e.object.material.color.set(getHoverColor())
            e.object.material.emissiveIntensity = 0.25
          }
          setHovered(true)
        }}
        onPointerOut={(e) => {
          if (e.object.material) {
            e.object.material.color.set(getTileColor())
            e.object.material.emissiveIntensity = 0.08
          }
          setHovered(false)
        }}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={getTileColor()}
          emissive={glowIntensity > 0 ? getHoverColor() : getTileColor()}
          emissiveIntensity={glowIntensity > 0 ? glowIntensity : 0.08}
          roughness={tile.type === "water" ? 0.1 : 0.8}
          metalness={tile.type === "water" ? 0.4 : 0.1}
          transparent={tile.type === "water"}
          opacity={tile.type === "water" ? 0.8 : 1.0}
        />
      </Box>

      {/* Vibrant tile effect overlay */}
      {tileEffect && (
        <group position={[0, 0.2, 0]}>
          <Box args={[2.2, 0.05, 2.2]} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={tileEffect === "purchase" ? "#3cb371" : "#1e90ff"}
              transparent
              opacity={0.7}
              emissive={tileEffect === "purchase" ? "#3cb371" : "#1e90ff"}
              emissiveIntensity={0.5}
            />
          </Box>
        </group>
      )}

      {/* Enhanced ownership indicator with vibrant glow */}
      {tile.owner === gameState.player.name && (
        <Box args={[2.0, 0.05, 2.0]} position={[0, -0.02, 0]} receiveShadow>
          <meshStandardMaterial color="#2e8b57" transparent opacity={0.8} emissive="#2e8b57" emissiveIntensity={0.25} />
        </Box>
      )}

      {/* Buy indicator with vibrant effects */}
      {showBuyIndicator && (
        <group position={[0, 0.5, 0]}>
          <Box args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} castShadow>
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.4} />
          </Box>
          <Box args={[0.2, 0.8, 0.2]} position={[0, 0.6, 0]} castShadow>
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.4} />
          </Box>
        </group>
      )}

      {/* Sell indicator with vibrant effects */}
      {showSellIndicator && (
        <group position={[0, 0.5, 0]}>
          <Box args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} castShadow>
            <meshStandardMaterial color="#ff1493" emissive="#ff1493" emissiveIntensity={0.4} />
          </Box>
          <Box args={[0.2, 0.8, 0.2]} position={[0, -0.6, 0]} castShadow>
            <meshStandardMaterial color="#ff1493" emissive="#ff1493" emissiveIntensity={0.4} />
          </Box>
        </group>
      )}

      {/* Tree planting indicator */}
      {showTreeIndicator && (
        <group position={[0, 0.5, 0]}>
          <Box args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} castShadow>
            <meshStandardMaterial color="#228b22" emissive="#228b22" emissiveIntensity={0.4} />
          </Box>
          <Box args={[0.2, 1.2, 0.2]} position={[0, 0.8, 0]} castShadow>
            <meshStandardMaterial color="#228b22" emissive="#228b22" emissiveIntensity={0.4} />
          </Box>
          <Box args={[0.8, 0.4, 0.8]} position={[0, 1.4, 0]} castShadow>
            <meshStandardMaterial color="#32cd32" emissive="#32cd32" emissiveIntensity={0.3} />
          </Box>
        </group>
      )}

      {/* Player-planted trees */}
      {tile.type === "tree" && tile.treeType && <Tree position={[0, 0.1, 0]} type={tile.treeType} scale={1.2} />}

      {/* Enhanced crop growth with vibrant lush greens */}
      {tile.type === "crop" && (
        <group position={[0, 0.2, 0]} scale={[plantScale, plantScale, plantScale]}>
          {/* Plant stem - vibrant color */}
          <Box args={[0.1, 0.3 + growthStage * 0.2, 0.1]} position={[0, (0.3 + growthStage * 0.2) / 2, 0]} castShadow>
            <meshStandardMaterial color="#3cb371" emissive="#3cb371" emissiveIntensity={0.15} />
          </Box>

          {/* Stage 1: Sprout - vibrant green */}
          {growthStage >= 0 && (
            <Box args={[0.2, 0.05, 0.1]} position={[0.1, 0.2, 0]} castShadow>
              <meshStandardMaterial color="#2e8b57" emissive="#2e8b57" emissiveIntensity={0.2} />
            </Box>
          )}

          {/* Stage 2: Mid growth - vibrant lush foliage */}
          {growthStage >= 1 && (
            <>
              <Box args={[0.3, 0.1, 0.1]} position={[0.15, 0.4, 0]} castShadow>
                <meshStandardMaterial color="#3cb371" emissive="#3cb371" emissiveIntensity={0.18} />
              </Box>
              <Box args={[0.3, 0.1, 0.1]} position={[-0.15, 0.4, 0]} castShadow>
                <meshStandardMaterial color="#3cb371" emissive="#3cb371" emissiveIntensity={0.18} />
              </Box>
              <Box args={[0.1, 0.1, 0.3]} position={[0, 0.4, 0.15]} castShadow>
                <meshStandardMaterial color="#3cb371" emissive="#3cb371" emissiveIntensity={0.18} />
              </Box>
            </>
          )}

          {/* Stage 3: Fully grown - vibrant golden fruit */}
          {growthStage >= 2 && (
            <Box args={[0.2, 0.2, 0.2]} position={[0, 0.6, 0]} castShadow>
              <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
            </Box>
          )}

          {/* Enhanced growth particles with vibrant glow */}
          {tile.growth > 0 && tile.growth < 100 && (
            <>
              <Box args={[0.05, 0.05, 0.05]} position={[0.2, 0.5, 0.2]} castShadow>
                <meshStandardMaterial
                  color="#2e8b57"
                  transparent
                  opacity={0.9}
                  emissive="#2e8b57"
                  emissiveIntensity={0.4}
                />
              </Box>
              <Box args={[0.05, 0.05, 0.05]} position={[-0.2, 0.6, -0.2]} castShadow>
                <meshStandardMaterial
                  color="#2e8b57"
                  transparent
                  opacity={0.9}
                  emissive="#2e8b57"
                  emissiveIntensity={0.4}
                />
              </Box>
            </>
          )}
        </group>
      )}

      {/* Enhanced money tree with vibrant golden effects */}
      {tile.type === "money-tree" && (
        <group position={[0, 0.3, 0]}>
          {/* Tree trunk */}
          <Box args={[0.3, 1.2, 0.3]} position={[0, 0.6, 0]} castShadow>
            <meshStandardMaterial color="#A0522D" roughness={0.8} metalness={0.2} />
          </Box>

          {/* Tree crown - vibrant golden colors */}
          <Box args={[1.2, 0.4, 1.2]} position={[0, 1.4, 0]} castShadow>
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
          </Box>
          <Box args={[1.0, 0.4, 1.0]} position={[0, 1.7, 0]} castShadow>
            <meshStandardMaterial color="#ffdf00" emissive="#ffdf00" emissiveIntensity={0.35} />
          </Box>
          <Box args={[0.8, 0.4, 0.8]} position={[0, 2.0, 0]} castShadow>
            <meshStandardMaterial color="#ffef00" emissive="#ffef00" emissiveIntensity={0.4} />
          </Box>

          {/* Golden coins floating around with vibrant glow */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Cylinder
              key={i}
              args={[0.1, 0.1, 0.05]}
              position={[Math.cos((i * Math.PI * 2) / 3) * 0.8, 1.5, Math.sin((i * Math.PI * 2) / 3) * 0.8]}
              castShadow
            >
              <meshStandardMaterial
                color="#ffd700"
                emissive="#ffd700"
                emissiveIntensity={0.5}
                metalness={0.5}
                roughness={0.2}
              />
            </Cylinder>
          ))}
        </group>
      )}

      {/* Water tile with vibrant crystal effects */}
      {tile.type === "water" && (
        <group position={[0, 0.1, 0]}>
          {/* Water ripples */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Cylinder key={i} args={[0.3 + i * 0.2, 0.3 + i * 0.2, 0.02]} position={[0, i * 0.01, 0]} castShadow>
              <meshStandardMaterial
                color="#1e90ff"
                transparent
                opacity={0.6 - i * 0.1}
                emissive="#1e90ff"
                emissiveIntensity={0.3}
                roughness={0.1}
                metalness={0.4}
              />
            </Cylinder>
          ))}
        </group>
      )}

      {/* Harvest count indicators with vibrant glow */}
      {tile.type === "land" && tile.harvestCount > 0 && (
        <group position={[0.7, 0.1, 0.7]}>
          {Array.from({ length: tile.harvestCount }).map((_, i) => (
            <Box key={i} args={[0.15, 0.15, 0.15]} position={[i * 0.2, 0, 0]} castShadow>
              <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.4} />
            </Box>
          ))}
        </group>
      )}

      {/* Enhanced growth percentage display with vibrant colors */}
      {tile.type === "crop" && (
        <group position={[0, 1.2, 0]}>
          {/* Background bar */}
          <Box args={[0.8, 0.1, 0.1]} position={[0, 0, 0]} castShadow>
            <meshStandardMaterial color="#1e5631" emissive="#1e5631" emissiveIntensity={0.15} />
          </Box>
          {/* Progress bar with vibrant colors */}
          <Box
            args={[(tile.growth / 100) * 0.8, 0.12, 0.12]}
            position={[-(0.8 - (tile.growth / 100) * 0.8) / 2, 0, 0]}
            castShadow
          >
            <meshStandardMaterial
              color={tile.growth >= 100 ? "#3cb371" : "#2e8b57"}
              emissive={tile.growth >= 100 ? "#3cb371" : "#2e8b57"}
              emissiveIntensity={0.25}
            />
          </Box>
        </group>
      )}

      {/* Boost indicator with enhanced vibrant glow */}
      {tile.type === "crop" && gameState.activeTileBoosts?.includes(tile.id) && (
        <group position={[0.8, 0.5, 0]}>
          <Box args={[0.3, 0.3, 0.3]} castShadow>
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5} />
          </Box>
        </group>
      )}

      {/* Enhanced decorative elements with vibrant effects */}
      {tile.type === "empty" && Math.random() > 0.7 && (
        <group position={[0, 0.1, 0]}>
          {/* Vibrant wildflowers */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Box
              key={i}
              args={[0.05, 0.25, 0.05]}
              position={[(Math.random() - 0.5) * 1.5, 0.125, (Math.random() - 0.5) * 1.5]}
              castShadow
            >
              <meshStandardMaterial color="#2e8b57" emissive="#2e8b57" emissiveIntensity={0.25} />
            </Box>
          ))}
        </group>
      )}
    </group>
  )
}

function DecorationElements() {
  return (
    <group>
      {/* Enhanced scattered rocks with rich earth tones */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Box
          key={i}
          args={[0.3 + Math.random() * 0.4, 0.2 + Math.random() * 0.3, 0.3 + Math.random() * 0.4]}
          position={[(Math.random() - 0.5) * 30, 0.1, (Math.random() - 0.5) * 30]}
          castShadow
        >
          <meshStandardMaterial color="#654321" roughness={0.8} metalness={0.2} />
        </Box>
      ))}

      {/* Enhanced flower patches with vibrant colors */}
      {Array.from({ length: 15 }).map((_, i) => (
        <group key={i} position={[(Math.random() - 0.5) * 25, 0.1, (Math.random() - 0.5) * 25]}>
          <Box args={[0.1, 0.3, 0.1]} castShadow>
            <meshStandardMaterial color="#3cb371" emissive="#3cb371" emissiveIntensity={0.15} />
          </Box>
          <Box args={[0.2, 0.1, 0.2]} position={[0, 0.35, 0]} castShadow>
            <meshStandardMaterial
              color={["#ffd700", "#ff1493", "#2e8b57", "#1e90ff"][Math.floor(Math.random() * 4)]}
              emissive={["#ffd700", "#ff1493", "#2e8b57", "#1e90ff"][Math.floor(Math.random() * 4)]}
              emissiveIntensity={0.4}
            />
          </Box>
        </group>
      ))}

      {/* Enhanced dirt paths with rich warm soil */}
      <Box args={[2, 0.02, 20]} position={[8, 0, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#A0522D" roughness={0.9} emissive="#A0522D" emissiveIntensity={0.05} />
      </Box>
      <Box args={[20, 0.02, 2]} position={[0, 0, 8]} receiveShadow castShadow>
        <meshStandardMaterial color="#A0522D" roughness={0.9} emissive="#A0522D" emissiveIntensity={0.05} />
      </Box>
    </group>
  )
}

function House(props: GroupProps) {
  const gltf = useGLTF('/smallTent.glb')

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ('castShadow' in child) child.castShadow = true
      if ('receiveShadow' in child) child.receiveShadow = true
    })
  }, [gltf])

  return <primitive object={gltf.scene} scale={4} {...props} />
}
function House2(props: GroupProps) {
  const gltf = useGLTF('/bigTent.glb')

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ('castShadow' in child) child.castShadow = true
      if ('receiveShadow' in child) child.receiveShadow = true
    })
  }, [gltf])

  return <primitive object={gltf.scene} scale={4} {...props} />
}
function House3(props: GroupProps) {
  const gltf = useGLTF('/bigTent1.glb')

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ('castShadow' in child) child.castShadow = true
      if ('receiveShadow' in child) child.receiveShadow = true
    })
  }, [gltf])

  return <primitive object={gltf.scene} scale={4} {...props} />
}
function House4(props: GroupProps) {
  const gltf = useGLTF('/bigTent2.glb')

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ('castShadow' in child) child.castShadow = true
      if ('receiveShadow' in child) child.receiveShadow = true
    })
  }, [gltf])

  return <primitive object={gltf.scene} scale={4} {...props} />
}
function Tree(props: GroupProps) {
  const gltf = useGLTF('/tree.glb')

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ('castShadow' in child) child.castShadow = true
      if ('receiveShadow' in child) child.receiveShadow = true
    })
  }, [gltf])

  return <primitive object={gltf.scene} scale={4} {...props} />
}
function Campfire(props: GroupProps) {
  const gltf = useGLTF('/campfire.glb')

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ('castShadow' in child) child.castShadow = true
      if ('receiveShadow' in child) child.receiveShadow = true
    })
  }, [gltf])

  return <primitive object={gltf.scene} scale={4} {...props} />
}
function Cactus(props: GroupProps) {
  const gltf = useGLTF('/cactus.glb')

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ('castShadow' in child) child.castShadow = true
      if ('receiveShadow' in child) child.receiveShadow = true
    })
  }, [gltf])

  return <primitive object={gltf.scene} scale={4} {...props} />
}
// Enhanced weather system with vibrant effects
function WeatherSystem({ weatherType = "clear" }: { weatherType?: "clear" | "rain" | "snow" | "cloudy" }) {
  if (weatherType === "clear") return null

  if (weatherType === "rain") {
    return (
      <group>
        {Array.from({ length: 50 }).map((_, i) => (
          <Box
            key={i}
            args={[0.03, 0.2, 0.03]}
            position={[(Math.random() - 0.5) * 40, 10 + Math.random() * 10, (Math.random() - 0.5) * 40]}
            castShadow
          >
            <meshStandardMaterial
              color="#1e90ff"
              transparent
              opacity={0.8}
              emissive="#1e90ff"
              emissiveIntensity={0.3}
            />
          </Box>
        ))}
      </group>
    )
  }

  return null
}

export default function GameWorld({
  tiles,
  onTileClick,
  selectedTool,
  onPlantInteraction,
  onTileTransaction,
}: GameWorldProps) {
  const [weather, setWeather] = useState<"clear" | "rain" | "snow" | "cloudy">("clear")

  // // Change weather randomly every 60 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const weathers = ["clear", "rain"] as const
  //     setWeather(weathers[Math.floor(Math.random() * weathers.length)])
  //   }, 60000)

  //   return () => clearInterval(interval)
  // }, [])

  return (
    <group>
      {/* Ground plane and environment */}
      <GroundPlane />

      {/* Decorative elements */}
      <DecorationElements />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[20, 25, 20]} // high above
        intensity={4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Optional: Realistic sky */}
      <Sky sunPosition={[100, 100, 100]} />
      {/* Optional: Environment light for better material rendering */}
      {/* <Environment preset="sunset" /> */}

      {/* Houses near corners */}
      <Suspense fallback={null}>
        <House position={[13, 0, 13]} />
        <House2 position={[-13, 0, 13]} />
        <House3 position={[13, 0, -13]} />
        <House4 position={[-13, 0, -13]} />
        <Tree position={[-13, 0, -16]}/>
        <Campfire position={[-11, 0, -10]}/>
        <Cactus position={[-10, 0, -16]}/>
      </Suspense>

      {/* Weather system */}
      <WeatherSystem weatherType={weather} />

      {/* Game tiles */}
      {tiles.map((tile) => (
        <GameTile
          key={tile.id}
          tile={tile}
          onClick={() => onTileClick(tile.id)}
          selectedTool={selectedTool}
          onPlantInteraction={onPlantInteraction}
          onTileTransaction={onTileTransaction}
        />
      ))}
    </group>
  )
}
