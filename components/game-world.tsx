
"use client"

import { useRef, useState, useEffect, Suspense, useMemo, useCallback } from "react"
import {  useFrame } from "@react-three/fiber"
import { Box, Cylinder, Plane, Sky, useGLTF } from "@react-three/drei"
import * as THREE from 'three'

// Types
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

// Mock game state for demonstration
const mockGameState = {
  player: { name: "Player1" },
  activeTileBoosts: ["tile1", "tile2"]
}

// Constants
const COLORS = {
  grass: "#78C850",
  soil: "#A0522D",
  water: "#1e90ff",
  gold: "#ffd700",
  green: "#3cb371",
  forestGreen: "#2e8b57",
  pink: "#ff1493",
  skyBlue: "#b2e0ff",
  brown: "#654321"
} as const

const TILE_COLORS = {
  empty: COLORS.skyBlue,
  land: "#c19a70",
  water: COLORS.water,
  tree: COLORS.forestGreen,
  crop: (growth: number) => growth >= 100 ? COLORS.gold : COLORS.green,
  "money-tree": "#c19a70"
} as const

// Utility functions
const getTileColor = (tile: Tile) => {
  if (tile.price) {
    if (tile.price < 50) return "#90EE90"
    if (tile.price < 100) return "#FFFFE0"
    if (tile.price < 200) return "#FFA500"
    return "#DC143C"
  }

  return tile.type === "crop" 
    ? TILE_COLORS.crop(tile.growth)
    : TILE_COLORS[tile.type] || COLORS.skyBlue
}

const getHoverColor = (selectedTool: string, tile: Tile, playerName: string) => {
  switch (selectedTool) {
    case "buy":
      if (tile.type === "empty") return COLORS.gold
      if (tile.owner === playerName) return COLORS.pink
      return getTileColor(tile)
    case "plant":
      return tile.type === "land" ? COLORS.forestGreen : getTileColor(tile)
    case "tree":
      return tile.type === "land" ? "#228b22" : getTileColor(tile)
    case "harvest":
      return (tile.type === "crop" && tile.growth >= 100) || tile.type === "money-tree" 
        ? COLORS.pink : getTileColor(tile)
    default:
      return getTileColor(tile)
  }
}

// Components
function GroundPlane() {
  return (
    <group>
      {/* Main grass ground */}
      <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <meshStandardMaterial
          color={COLORS.grass}
          roughness={0.8}
          metalness={0.1}
          emissive={COLORS.grass}
          emissiveIntensity={0.08}
        />
      </Plane>

      {/* Dirt patches */}
      <Box args={[12, 0.05, 12]} position={[0, -0.05, 0]} receiveShadow>
        <meshStandardMaterial
          color={COLORS.soil}
          roughness={0.9}
          metalness={0.1}
          emissive={COLORS.soil}
          emissiveIntensity={0.05}
        />
      </Box>

      {/* Grass patches */}
      {Array.from({ length: 30 }, (_, i) => (
        <Box
          key={i}
          args={[0.4, 0.15, 0.4]}
          position={[(Math.random() - 0.5) * 40, 0, (Math.random() - 0.5) * 40]}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial 
            color={COLORS.green} 
            roughness={0.7} 
            emissive={COLORS.green} 
            emissiveIntensity={0.12} 
          />
        </Box>
      ))}

      {/* Fence */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2
        const radius = 7
        return (
          <Box
            key={i}
            args={[0.1, 0.8, 0.1]}
            position={[Math.cos(angle) * radius, 0.4, Math.sin(angle) * radius]}
            castShadow
          >
            <meshStandardMaterial color={COLORS.brown} roughness={0.8} metalness={0.2} />
          </Box>
        )
      })}

      {/* Stone path */}
      {/* {Array.from({ length: 12 }, (_, i) => (
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
      ))} */}

      {/* Water features */}
      {Array.from({ length: 5 }, (_, i) => (
        <Cylinder
          key={i}
          args={[0.8, 0.8, 0.05]}
          position={[(Math.random() - 0.5) * 30, 0.02, (Math.random() - 0.5) * 30]}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial
            color={COLORS.water}
            roughness={0.1}
            metalness={0.4}
            emissive={COLORS.water}
            emissiveIntensity={0.25}
            transparent
            opacity={0.85}
          />
        </Cylinder>
      ))}
    </group>
  )
}

function CropComponent({ tile, plantScale }: { tile: Tile; plantScale: number }) {
  const growthStage = useMemo(() => {
    if (tile.growth < 30) return 0
    if (tile.growth < 70) return 1
    return 2
  }, [tile.growth])

  return (
    <group position={[0, 0.2, 0]} scale={[plantScale, plantScale, plantScale]}>
      {/* Plant stem */}
      <Box args={[0.1, 0.3 + growthStage * 0.2, 0.1]} position={[0, (0.3 + growthStage * 0.2) / 2, 0]} castShadow>
        <meshStandardMaterial color={COLORS.green} emissive={COLORS.green} emissiveIntensity={0.15} />
      </Box>

      {/* Growth stages */}
      {growthStage >= 0 && (
        <Box args={[0.2, 0.05, 0.1]} position={[0.1, 0.2, 0]} castShadow>
          <meshStandardMaterial color={COLORS.forestGreen} emissive={COLORS.forestGreen} emissiveIntensity={0.2} />
        </Box>
      )}

      {growthStage >= 1 && (
        <>
          <Box args={[0.3, 0.1, 0.1]} position={[0.15, 0.4, 0]} castShadow>
            <meshStandardMaterial color={COLORS.green} emissive={COLORS.green} emissiveIntensity={0.18} />
          </Box>
          <Box args={[0.3, 0.1, 0.1]} position={[-0.15, 0.4, 0]} castShadow>
            <meshStandardMaterial color={COLORS.green} emissive={COLORS.green} emissiveIntensity={0.18} />
          </Box>
          <Box args={[0.1, 0.1, 0.3]} position={[0, 0.4, 0.15]} castShadow>
            <meshStandardMaterial color={COLORS.green} emissive={COLORS.green} emissiveIntensity={0.18} />
          </Box>
        </>
      )}

      {growthStage >= 2 && (
        <Box args={[0.2, 0.2, 0.2]} position={[0, 0.6, 0]} castShadow>
          <meshStandardMaterial color={COLORS.gold} emissive={COLORS.gold} emissiveIntensity={0.3} />
        </Box>
      )}

      {/* Growth particles */}
      {tile.growth > 0 && tile.growth < 100 && (
        <>
          <Box args={[0.05, 0.05, 0.05]} position={[0.2, 0.5, 0.2]} castShadow>
            <meshStandardMaterial
              color={COLORS.forestGreen}
              transparent
              opacity={0.9}
              emissive={COLORS.forestGreen}
              emissiveIntensity={0.4}
            />
          </Box>
          <Box args={[0.05, 0.05, 0.05]} position={[-0.2, 0.6, -0.2]} castShadow>
            <meshStandardMaterial
              color={COLORS.forestGreen}
              transparent
              opacity={0.9}
              emissive={COLORS.forestGreen}
              emissiveIntensity={0.4}
            />
          </Box>
        </>
      )}
    </group>
  )
}

function MoneyTree() {
  return (
    <group position={[0, 0.3, 0]}>
      {/* Tree trunk */}
      <Box args={[0.3, 1.2, 0.3]} position={[0, 0.6, 0]} castShadow>
        <meshStandardMaterial color={COLORS.soil} roughness={0.8} metalness={0.2} />
      </Box>

      {/* Tree crown layers */}
      <Box args={[1.2, 0.4, 1.2]} position={[0, 1.4, 0]} castShadow>
        <meshStandardMaterial color={COLORS.gold} emissive={COLORS.gold} emissiveIntensity={0.3} />
      </Box>
      <Box args={[1.0, 0.4, 1.0]} position={[0, 1.7, 0]} castShadow>
        <meshStandardMaterial color="#ffdf00" emissive="#ffdf00" emissiveIntensity={0.35} />
      </Box>
      <Box args={[0.8, 0.4, 0.8]} position={[0, 2.0, 0]} castShadow>
        <meshStandardMaterial color="#ffef00" emissive="#ffef00" emissiveIntensity={0.4} />
      </Box>

      {/* Floating coins */}
      {Array.from({ length: 3 }, (_, i) => (
        <Cylinder
          key={i}
          args={[0.1, 0.1, 0.05]}
          position={[Math.cos((i * Math.PI * 2) / 3) * 0.8, 1.5, Math.sin((i * Math.PI * 2) / 3) * 0.8]}
          castShadow
        >
          <meshStandardMaterial
            color={COLORS.gold}
            emissive={COLORS.gold}
            emissiveIntensity={0.5}
            metalness={0.5}
            roughness={0.2}
          />
        </Cylinder>
      ))}
    </group>
  )
}

function GLBpowerModel({ path }: { path: string }) {
  const gltf = useGLTF(path)

  return <primitive object={gltf.scene} scale={1.5} />
}

function WaterTile() {
  return (
    <group position={[0, 0.1, 0]}>
      {Array.from({ length: 3 }, (_, i) => (
        <Cylinder key={i} args={[0.3 + i * 0.2, 0.3 + i * 0.2, 0.02]} position={[0, i * 0.01, 0]} castShadow>
          <meshStandardMaterial
            color={COLORS.water}
            transparent
            opacity={0.6 - i * 0.1}
            emissive={COLORS.water}
            emissiveIntensity={0.3}
            roughness={0.1}
            metalness={0.4}
          />
        </Cylinder>
      ))}
    </group>
  )
}

function ToolIndicator({ tool, position }: { tool: string; position: [number, number, number] }) {
  const colors = {
    buy: COLORS.gold,
    sell: COLORS.pink,
    tree: "#228b22"
  }

  const color = colors[tool as keyof typeof colors] || COLORS.gold

  return (
    <group position={position}>
      <Box args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </Box>
      <Box 
        args={[0.2, 0.8, 0.2]} 
        position={[0, tool === "sell" ? -0.6 : 0.6, 0]} 
        castShadow
      >
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </Box>
      {tool === "tree" && (
        <Box args={[0.8, 0.4, 0.8]} position={[0, 1.4, 0]} castShadow>
          <meshStandardMaterial color="#32cd32" emissive="#32cd32" emissiveIntensity={0.3} />
        </Box>
      )}
    </group>
  )
}

// function GLBTreeModel({ path }: { path: string }) {
//   const gltf = useGLTF(path)
//   return <primitive object={gltf.scene} scale={0.08} />
// }

export function GLBTreeModel({ path }: { path: string }) {
  const gltf = useGLTF(path)

  // Clone the gltf.scene so each instance is separate
  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true)
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = child.material.clone()
      }
    })
    return clone
  }, [gltf])

  return <primitive object={clonedScene} scale={0.17} />
}
// Mapping treeType to model path
const treeGLBPaths: Record<string, string> = {
  power: "/power1.glb",
 
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
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [plantScale, setPlantScale] = useState(0.3)
  const [tileEffect, setTileEffect] = useState<"purchase" | "sale" | null>(null)
  const [bounce, setBounce] = useState(false)
  const [isPurchased, setIsPurchased] = useState(false)

  const playerName = mockGameState.player.name

  const tileColor = useMemo(() => {
    // If tile was purchased by player or is owned by player and is land type, make it brown
    if (isPurchased || (tile.owner === playerName && tile.type === "land")) {
      return "#8B4513" // Brown color
    }
    return getTileColor(tile)
  }, [tile, playerName, isPurchased])
  
  const hoverColor = useMemo(() => getHoverColor(selectedTool, tile, playerName), [selectedTool, tile, playerName])

  useEffect(() => {
    if (tile.type === "crop") {
      const targetScale = 0.3 + (tile.growth / 100) * 0.7
      setPlantScale(targetScale)
    }
  }, [tile.growth])

  useFrame((state) => {
    if (meshRef.current && tile.position) {
      if (tile.type === "crop" || tile.type === "money-tree" || tile.type === "tree") {
        meshRef.current.position.y = tile.position[1] + Math.sin(state.clock.elapsedTime * 2 + tile.position[0]) * 0.03
      }
      if (tile.type === "water") {
        meshRef.current.position.y = tile.position[1] + Math.sin(state.clock.elapsedTime * 3 + tile.position[0] * 2) * 0.02
      }
      if (bounce) {
        meshRef.current.position.y = tile.position[1] + Math.abs(Math.sin(state.clock.elapsedTime * 5)) * 0.2
      }
    }
  })

  const handleClick = useCallback((event: THREE.Event) => {
    onClick()

    if (selectedTool === "buy" && onTileTransaction) {
      if (tile.type === "empty") {
        setTileEffect("purchase")
        setBounce(true)
        setIsPurchased(true) // Mark as purchased immediately
        setTimeout(() => {
          setTileEffect(null)
          setBounce(false)
        }, 2000)
        onTileTransaction(tile.id, "buy")
      } else if (tile.owner === playerName && tile.type === "land") {
        setTileEffect("sale")
        setBounce(true)
        setIsPurchased(false) // Mark as not purchased when sold
        setTimeout(() => {
          setTileEffect(null)
          setBounce(false)
        }, 2000)
        onTileTransaction(tile.id, "sell")
      }
    }

    if (tile.type === "crop" && onPlantInteraction) {
      const mouseEvent = event as any
      onPlantInteraction(tile.id, { 
        x: mouseEvent.clientX || 400, 
        y: mouseEvent.clientY || 300 
      })
    }
  }, [onClick, selectedTool, tile, onTileTransaction, onPlantInteraction, playerName])

  const handlePointerOver = useCallback((e: THREE.Event) => {
    const target = e.object as THREE.Mesh
    if (target.material && 'color' in target.material) {
      (target.material as THREE.MeshStandardMaterial).color.set(hoverColor)
      (target.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.25
    }
    setHovered(true)
  }, [hoverColor])

  const handlePointerOut = useCallback((e: THREE.Event) => {
    const target = e.object as THREE.Mesh
    if (target.material && 'color' in target.material) {
      (target.material as THREE.MeshStandardMaterial).color.set(tileColor)
      (target.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.08
    }
    setHovered(false)
  }, [tileColor])

  const showIndicator = hovered && (
    (selectedTool === "buy" && tile.type === "empty") ||
    (selectedTool === "buy" && tile.type !== "empty" && tile.owner === playerName) ||
    (selectedTool === "tree" && tile.type === "land")
  )

  const indicatorTool = selectedTool === "buy" && tile.type !== "empty" && tile.owner === playerName 
    ? "sell" 
    : selectedTool

  if (!tile.position) return null

  return (
    <group ref={meshRef} position={tile.position}>
      {/* Base tile */}
      <Box
        args={[1.8, 0.1, 1.8]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={tileColor}
          emissive={tileColor}
          emissiveIntensity={0.08}
          roughness={tile.type === "water" ? 0.1 : 0.8}
          metalness={tile.type === "water" ? 0.4 : 0.1}
          transparent={tile.type === "water"}
          opacity={tile.type === "water" ? 0.8 : 1.0}
        />
      </Box>

      {/* Tile effect overlay */}
      {tileEffect && (
        <group position={[0, 0.2, 0]}>
          <Box args={[2.2, 0.05, 2.2]} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={tileEffect === "purchase" ? COLORS.green : COLORS.water}
              transparent
              opacity={0.7}
              emissive={tileEffect === "purchase" ? COLORS.green : COLORS.water}
              emissiveIntensity={0.5}
            />
          </Box>
        </group>
      )}

      {/* Ownership indicator */}
      {tile.owner === playerName && (
        <Box args={[2.0, 0.05, 2.0]} position={[0, -0.02, 0]} receiveShadow>
          <meshStandardMaterial 
            color={COLORS.forestGreen} 
            transparent 
            opacity={0.8} 
            emissive={COLORS.forestGreen} 
            emissiveIntensity={0.25} 
          />
        </Box>
      )}

      {/* Tool indicators */}
      {showIndicator && (
        <ToolIndicator tool={indicatorTool} position={[0, 0.5, 0]} />
      )}

      {/* Tile content */}
      {tile.type === "crop" && <CropComponent tile={tile} plantScale={plantScale} />}
      {tile.type === "money-tree" && <GLBpowerModel path="/power.glb" />}
      {tile.type === "water" && <WaterTile />}

      {/* NEW — Render tree model */}
      {tile.type === "tree" && tile.treeType && (
        <GLBTreeModel path={treeGLBPaths[tile.treeType]} />
      )}

      {/* Growth progress bar */}
      {tile.type === "crop" && (
        <group position={[0, 1.2, 0]}>
          <Box args={[0.8, 0.1, 0.1]} position={[0, 0, 0]} castShadow>
            <meshStandardMaterial color="#1e5631" emissive="#1e5631" emissiveIntensity={0.15} />
          </Box>
          <Box
            args={[(tile.growth / 100) * 0.8, 0.12, 0.12]}
            position={[-(0.8 - (tile.growth / 100) * 0.8) / 2, 0, 0]}
            castShadow
          >
            <meshStandardMaterial
              color={tile.growth >= 100 ? COLORS.green : COLORS.forestGreen}
              emissive={tile.growth >= 100 ? COLORS.green : COLORS.forestGreen}
              emissiveIntensity={0.25}
            />
          </Box>
        </group>
      )}

      {/* Harvest count indicators */}
      {tile.type === "land" && tile.harvestCount > 0 && (
        <group position={[0.7, 0.1, 0.7]}>
          {Array.from({ length: tile.harvestCount }, (_, i) => (
            <Box key={i} args={[0.15, 0.15, 0.15]} position={[i * 0.2, 0, 0]} castShadow>
              <meshStandardMaterial color={COLORS.gold} emissive={COLORS.gold} emissiveIntensity={0.4} />
            </Box>
          ))}
        </group>
      )}

      {/* Boost indicator */}
      {tile.type === "crop" && mockGameState.activeTileBoosts?.includes(tile.id) && (
        <group position={[0.8, 0.5, 0]}>
          <Box args={[0.3, 0.3, 0.3]} castShadow>
            <meshStandardMaterial color={COLORS.gold} emissive={COLORS.gold} emissiveIntensity={0.5} />
          </Box>
        </group>
      )}
    </group>
  )
}


function DecorationElements() {
  const decorations = useMemo(() => ({
    rocks: Array.from({ length: 12 }, (_, i) => ({
      key: i,
      args: [0.3 + Math.random() * 0.4, 0.2 + Math.random() * 0.3, 0.3 + Math.random() * 0.4] as [number, number, number],
      position: [(Math.random() - 0.5) * 30, 0.1, (Math.random() - 0.5) * 30] as [number, number, number]
    })),
    flowers: Array.from({ length: 15 }, (_, i) => ({
      key: i,
      position: [(Math.random() - 0.5) * 25, 0.1, (Math.random() - 0.5) * 25] as [number, number, number],
      color: [COLORS.gold, COLORS.pink, COLORS.forestGreen, COLORS.water][Math.floor(Math.random() * 4)]
    }))
  }), [])

  return (
    <group>
      {/* Scattered rocks */}
      {decorations.rocks.map((rock) => (
        <Box key={rock.key} args={rock.args} position={rock.position} castShadow>
          <meshStandardMaterial color={COLORS.brown} roughness={0.8} metalness={0.2} />
        </Box>
      ))}

      {/* Flower patches */}
      {decorations.flowers.map((flower) => (
        <group key={flower.key} position={flower.position}>
          <Box args={[0.1, 0.3, 0.1]} castShadow>
            <meshStandardMaterial color={COLORS.green} emissive={COLORS.green} emissiveIntensity={0.15} />
          </Box>
          <Box args={[0.2, 0.1, 0.2]} position={[0, 0.35, 0]} castShadow>
            <meshStandardMaterial color={flower.color} emissive={flower.color} emissiveIntensity={0.4} />
          </Box>
        </group>
      ))}

      {/* Dirt paths */}
      <Box args={[2, 0.02, 20]} position={[8, 0, 0]} receiveShadow castShadow>
        <meshStandardMaterial color={COLORS.soil} roughness={0.9} emissive={COLORS.soil} emissiveIntensity={0.05} />
      </Box>
      <Box args={[20, 0.02, 2]} position={[0, 0, 8]} receiveShadow castShadow>
        <meshStandardMaterial color={COLORS.soil} roughness={0.9} emissive={COLORS.soil} emissiveIntensity={0.05} />
      </Box>
    </group>
  )
}

// Model components with error handling

function ModelComponent({
  path,
  scale = 4,
  ...props
}: {
  path: string;
  scale?: number;
} & Omit<React.ComponentProps<'primitive'>, 'object'>) {
  const { scene } = useGLTF(path);

  // Deep clone the scene so it can be reused safely
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ('castShadow' in child) child.castShadow = true;
      if ('receiveShadow' in child) child.receiveShadow = true;
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} scale={scale} {...props} />;
}

// Weather system
function WeatherSystem({ weatherType = "clear" }: { weatherType?: "clear" | "rain" | "snow" | "cloudy" }) {
  if (weatherType !== "rain") return null

  const raindrops = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      key: i,
      position: [(Math.random() - 0.5) * 40, 10 + Math.random() * 10, (Math.random() - 0.5) * 40] as [number, number, number]
    }))
  , [])

  return (
    <group>
      {raindrops.map((drop) => (
        <Box key={drop.key} args={[0.03, 0.2, 0.03]} position={drop.position} castShadow>
          <meshStandardMaterial
            color={COLORS.water}
            transparent
            opacity={0.8}
            emissive={COLORS.water}
            emissiveIntensity={0.3}
          />
        </Box>
      ))}
    </group>
  )
}
export default function GameWorld({
  tiles,
  onTileClick,
  selectedTool,
  onPlantInteraction,
  onTileTransaction,
}: GameWorldProps) {
  const [weather, setWeather] = useState<"clear" | "rain" | "snow" | "cloudy">("clear")

  // Change weather randomly every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const weathers = ["clear", "rain", "snow", "cloudy"] as const
      setWeather(weathers[Math.floor(Math.random() * weathers.length)])
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <group>
      {/* Ground plane and environment */}
      <GroundPlane />

      {/* Decorative elements */}
      <DecorationElements />

      {/* Lighting setup */}
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
        shadow-camera-far={100}
        shadow-camera-near={0.1}
      />

      {/* Realistic sky */}
      {/* <Sky sunPosition={[100, 100, 100]} /> */}

      {/* Houses near corners */}
      <Suspense fallback={null}>
        <ModelComponent path="/bigTent.glb" position={[-15, 0, 13]} scale={4} />
        <ModelComponent path="/smallTent.glb" position={[16, 0, 16]} />
        <ModelComponent path="/bigTent.glb" position={[-16, 0, 13]} scale={4} />
        <ModelComponent path="/bigTent.glb" position={[-20, 0, 15]} scale={4} />
        <ModelComponent path="/bigTent1.glb" position={[13, 0, -13]} scale={4} />
        <ModelComponent path="/bigTent1.glb" position={[9, 0, -13]} scale={4} />
        <ModelComponent path="/bigTent2.glb" position={[-13, 0, -13]} scale={4} />
        <ModelComponent path="/campfire.glb" position={[15, 0, -16]} scale={4} />
        <ModelComponent path="/bigTent.glb" position={[-16, 0, -13]} scale={4} />
        <ModelComponent path="/bigTent.glb" position={[-10, 0, -13]} scale={4} />
        <ModelComponent path="/pond.glb" position={[10, 0, 10]} scale={1} />
        <ModelComponent path="/tree.glb" position={[-13, 0, -16]} scale={4} />
        <ModelComponent path="/tree.glb" position={[-10, 0, 0]} scale={4} />
        <ModelComponent path="/tree.glb" position={[20, 0, -11]} scale={4} />
        <ModelComponent path="/tree.glb" position={[20, 0, -11]} scale={4} />
        <ModelComponent path="/tree.glb" position={[10, 0, 11]} scale={4} />
        <ModelComponent path="/tree.glb" position={[-10, 0, 11]} scale={4} />
        <ModelComponent path="/campfire.glb" position={[-11, 0, -10]} scale={8} />
        <ModelComponent path="/cactus.glb" position={[-10, 0, -16]} scale={4} />
        {/* <ModelComponent path="/models/pond.glb" position={[0, 0, 0]} scale={4} /> */}
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

      {/* Optional: Environment light for better material rendering */}
      {/* <Environment preset="sunset" /> */}
    </group>
  )
}