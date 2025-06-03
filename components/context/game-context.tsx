"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface GameState {
  player: {
    name: string
    level: number
    xp: number
    maxXp: number
    avatar: string
  }
  resources: {
    gold: number
    gems: number
    energy: number
    maxEnergy: number
  }
  tiles: Array<{
    id: string
    position: [number, number, number]
    type: "empty" | "land" | "crop" | "money-tree" | "tree"
    growth: number
    harvestCount: number
    owner?: string | null
    price?: number
    treeType?: "pine" | "oak" | "palm" | "fancy" // Added tree type
  }>
  inventory: Array<{
    id: string
    name: string
    type: "crop" | "tool" | "booster" | "building"
    quantity: number
    rarity: "common" | "rare" | "epic" | "legendary"
  }>
  achievements: Array<{
    id: string
    name: string
    description: string
    completed: boolean
    reward: string
  }>
  activeTileBoosts?: string[]
  weather?: "clear" | "rain" | "snow" | "cloudy"
}

interface GameContextType {
  gameState: GameState
  currentScreen: string
  setCurrentScreen: (screen: string) => void
  updateResources: (resources: Partial<GameState["resources"]>) => void
  addToInventory: (item: GameState["inventory"][0]) => void
  updatePlayer: (player: Partial<GameState["player"]>) => void
  updateGameTile: (tileId: string, updates: Partial<GameState["tiles"][0]>) => void
  addTileBoost: (tileId: string, duration: number) => void
  setWeather: (weather: "clear" | "rain" | "snow" | "cloudy") => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState("dashboard")
  const [gameState, setGameState] = useState<GameState>({
    player: {
      name: "Farmer",
      level: 5,
      xp: 80,
      maxXp: 100,
      avatar: "🧑‍🌾",
    },
    resources: {
      gold: 5000,
      gems: 500,
      energy: 100,
      maxEnergy: 100,
    },
    tiles: [],
    inventory: [
      { id: "1", name: "Wheat Seeds", type: "crop", quantity: 25, rarity: "common" },
      { id: "2", name: "Corn Seeds", type: "crop", quantity: 15, rarity: "common" },
      { id: "3", name: "Tomato Seeds", type: "crop", quantity: 10, rarity: "rare" },
      { id: "4", name: "Pumpkin Seeds", type: "crop", quantity: 5, rarity: "epic" },
      { id: "5", name: "Fertilizer", type: "booster", quantity: 10, rarity: "rare" },
    ],
    achievements: [
      {
        id: "first_plant",
        name: "First Sprout",
        description: "Plant your first crop",
        completed: true,
        reward: "50 Gold",
      },
      {
        id: "first_harvest",
        name: "First Harvest",
        description: "Harvest your first crop",
        completed: true,
        reward: "100 Gold",
      },
      {
        id: "money_tree",
        name: "Money Tree Master",
        description: "Grow your first money tree",
        completed: false,
        reward: "200 Gold",
      },
      {
        id: "tree_planter",
        name: "Tree Planter",
        description: "Plant your first tree",
        completed: false,
        reward: "150 Gold",
      },
      {
        id: "forest_creator",
        name: "Forest Creator",
        description: "Plant 5 trees",
        completed: false,
        reward: "500 Gold",
      },
      {
        id: "land_owner",
        name: "Land Owner",
        description: "Own 10 tiles of land",
        completed: false,
        reward: "500 Gold",
      },
      {
        id: "crop_master",
        name: "Crop Master",
        description: "Harvest 50 crops",
        completed: false,
        reward: "1000 Gold",
      },
      {
        id: "wealthy_farmer",
        name: "Wealthy Farmer",
        description: "Accumulate 10,000 gold",
        completed: false,
        reward: "100 Gems",
      },
      {
        id: "level_up",
        name: "Level Up",
        description: "Reach level 10",
        completed: false,
        reward: "250 Gems",
      },
      {
        id: "collector",
        name: "Collector",
        description: "Have 20 different items in inventory",
        completed: false,
        reward: "300 Gold",
      },
    ],
    activeTileBoosts: [],
    weather: "clear",
  })

  // Initialize tiles in a simple grid layout
  useEffect(() => {
    const initialTiles = []
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        initialTiles.push({
          id: `${row}-${col}`,
          position: [col * 2 - 4, 0, row * 2 - 4] as [number, number, number],
          type: row < 2 && col < 2 ? "land" : "empty",
          growth: 0,
          harvestCount: 0,
          owner: row < 2 && col < 2 ? gameState.player.name : null,
          price: 20,
        })
      }
    }
    setGameState((prev) => ({ ...prev, tiles: initialTiles }))
  }, [])

  const updateResources = (resources: Partial<GameState["resources"]>) => {
    setGameState((prev) => ({
      ...prev,
      resources: { ...prev.resources, ...resources },
    }))
  }

  const addToInventory = (item: GameState["inventory"][0]) => {
    const existingItemIndex = gameState.inventory.findIndex(
      (i) => i.name === item.name && i.type === item.type && i.rarity === item.rarity,
    )

    if (existingItemIndex >= 0) {
      setGameState((prev) => ({
        ...prev,
        inventory: prev.inventory.map((i, index) =>
          index === existingItemIndex ? { ...i, quantity: i.quantity + item.quantity } : i,
        ),
      }))
    } else {
      setGameState((prev) => ({
        ...prev,
        inventory: [...prev.inventory, item],
      }))
    }
  }

  const updatePlayer = (player: Partial<GameState["player"]>) => {
    setGameState((prev) => ({
      ...prev,
      player: { ...prev.player, ...player },
    }))
  }

  const updateGameTile = (tileId: string, updates: Partial<GameState["tiles"][0]>) => {
    setGameState((prev) => ({
      ...prev,
      tiles: prev.tiles.map((tile) => (tile.id === tileId ? { ...tile, ...updates } : tile)),
    }))

    // Check for tree planting achievement
    if (updates.type === "tree") {
      const treeCount = gameState.tiles.filter((t) => t.type === "tree").length + 1
      if (treeCount === 1) {
        // First tree achievement
        setGameState((prev) => ({
          ...prev,
          achievements: prev.achievements.map((a) => (a.id === "tree_planter" ? { ...a, completed: true } : a)),
        }))
      } else if (treeCount >= 5) {
        // Forest creator achievement
        setGameState((prev) => ({
          ...prev,
          achievements: prev.achievements.map((a) => (a.id === "forest_creator" ? { ...a, completed: true } : a)),
        }))
      }
    }
  }

  const addTileBoost = (tileId: string, duration: number) => {
    setGameState((prev) => ({
      ...prev,
      activeTileBoosts: [...(prev.activeTileBoosts || []), tileId],
    }))

    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        activeTileBoosts: (prev.activeTileBoosts || []).filter((id) => id !== tileId),
      }))
    }, duration)
  }

  const setWeather = (weather: "clear" | "rain" | "snow" | "cloudy") => {
    setGameState((prev) => ({
      ...prev,
      weather,
    }))
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        currentScreen,
        setCurrentScreen,
        updateResources,
        addToInventory,
        updatePlayer,
        updateGameTile,
        addTileBoost,
        setWeather,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
