"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useGame } from "@/components/context/game-context"
import {
  Coins,
  Gem,
  Zap,
  Map,
  Backpack,
  Hammer,
  User,
  Home,
  ShoppingCart,
  Settings,
  Sprout,
  Navigation,
  Scissors,
  X,
  TreePine,
  Heart,
  Leaf,
  Sparkles,
  Power,
  Factory,
} from "lucide-react"

interface GameHUDProps {
  selectedTool: "move" | "buy" | "plant" | "harvest" | "tree"
  setSelectedTool: (tool: "move" | "buy" | "plant" | "harvest" | "tree") => void
  message?: { text: string; type: "success" | "error" | "info" } | null
  showMessage?: (text: string, type?: "success" | "error" | "info") => void
}

export default function GameHUD({ selectedTool, setSelectedTool, message }: GameHUDProps) {
  const { gameState, setCurrentScreen, currentScreen } = useGame()

  const tools = [
    // {
    //   id: "move" as const,
    //   name: "Explore",
    //   icon: Navigation,
    //   gradientClass: "gradient-sage",
    //   description: "WASD: Explore your world",
    //   cost: null,
    // },
    {
      id: "buy" as const,
      name: "Claim Land",
      icon: Leaf,
      gradientClass: "gradient-emerald",
      description: "Click tiles to claim land",
      cost: 20,
    },
    {
      id: "plant" as const,
      name: "Plant Seeds",
      icon: Sprout,
      gradientClass: "gradient-green",
      description: "Click soil to plant crops",
      cost: 10,
    },
    {
      id: "tree" as const,
      name: "power plant ",
      icon: Factory,
      gradientClass: "gradient-forest",
      description: "Click plant a power plant",
      cost: 15,
    },
    {
      id: "harvest" as const,
      name: "Harvest",
      icon: Scissors,
      gradientClass: "gradient-yellow",
      description: "Click crops to harvest",
      cost: null,
    },
  ]

  // Count different tile types for stats
  const stats = {
    ownedLand: gameState.tiles.filter((t) => t.type === "land").length,
    growingCrops: gameState.tiles.filter((t) => t.type === "crop").length,
    readyCrops: gameState.tiles.filter((t) => t.type === "crop" && t.growth >= 100).length,
    moneyTrees: gameState.tiles.filter((t) => t.type === "money-tree").length,
    plantedTrees: gameState.tiles.filter((t) => t.type === "tree").length,
  }

  // Get message styling
  const getMessageStyling = () => {
    if (!message) return ""
    switch (message.type) {
      case "success":
        return "glass-card border-emerald-200 text-emerald-700"
      case "error":
        return "glass-card border-rose-200 text-rose-700"
      case "info":
        return "glass-card border-lavender-200 text-lavender-700"
      default:
        return "glass-card border-sage-200 text-sage-700"
    }
  }

  // Navigation items with fixed styling
  const navigationItems = [
    {
      screen: "dashboard",
      icon: Home,
      label: "Farm",
      activeClass: "gradient-emerald text-white border-0 shadow-lg scale-105",
      inactiveClass: "bg-white/80 border-sage-200 hover:bg-sage-50",
    },
    {
      screen: "build",
      icon: Hammer,
      label: "Build",
      activeClass: "gradient-sage text-white border-0 shadow-lg scale-105",
      inactiveClass: "bg-white/80 border-sage-200 hover:bg-sage-50",
    },
    {
      screen: "farm",
      icon: Sprout,
      label: "Crops",
      activeClass: "gradient-green text-white border-0 shadow-lg scale-105",
      inactiveClass: "bg-white/80 border-sage-200 hover:bg-sage-50",
    },
    {
      screen: "marketplace",
      icon: ShoppingCart,
      label: "Market",
      activeClass: "gradient-lavender text-white border-0 shadow-lg scale-105",
      inactiveClass: "bg-white/80 border-sage-200 hover:bg-sage-50",
    },
    {
      screen: "inventory",
      icon: Backpack,
      label: "Items",
      activeClass: "gradient-cream text-white border-0 shadow-lg scale-105",
      inactiveClass: "bg-white/80 border-sage-200 hover:bg-sage-50",
    },
  ]

  const sideNavigationItems = [
    {
      screen: "profile",
      icon: User,
      activeClass: "gradient-lavender text-white border-0 shadow-lg scale-105",
      inactiveClass: "bg-white/80 border-sage-200 hover:bg-sage-50",
    },
    {
      screen: "store",
      icon: Gem,
      activeClass: "gradient-cream text-white border-0 shadow-lg scale-105",
      inactiveClass: "bg-white/80 border-sage-200 hover:bg-sage-50",
    },
    {
      screen: "settings",
      icon: Settings,
      activeClass: "gradient-sage text-white border-0 shadow-lg scale-105",
      inactiveClass: "bg-white/80 border-sage-200 hover:bg-sage-50",
    },
  ]

  return (
    <>
      {/* Close Button for UI Screens */}
      {currentScreen !== "dashboard" && (
        <div className="absolute top-6 right-6 z-30">
          <Button onClick={() => setCurrentScreen("dashboard")} className="btn-danger shadow-lg">
            <X className="w-4 h-4 mr-2" />
            Return to Farm
          </Button>
        </div>
      )}

      {/* Top HUD - Only show when not in a screen */}
      {currentScreen === "dashboard" && (
        <>
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
            {/* Resources */}
            <div className="flex gap-4">
              {/* Gold card with refined gentle gold */}
              <Card className="glass-card border-2 border-yellow-200/50 shadow-lg">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-cream-200 rounded-xl flex items-center justify-center">
                    <Coins className="w-5 h-5" style={{ color: "#f4ce6a" }} />
                  </div>
                  <div>
                    <div className="font-bold text-xl" style={{ color: "#f4ce6a" }}>
                      {gameState.resources.gold}
                    </div>
                    <div className="text-xs font-medium" style={{ color: "#2e3d49" }}>
                      Gold Coins
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-2 border-lavender-200/50 shadow-lg">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-xl flex items-center justify-center">
                    <Gem className="w-5 h-5 text-lavender-600" />
                  </div>
                  <div>
                    <div className="font-bold text-xl text-lavender-700">{gameState.resources.gems}</div>
                    <div className="text-xs text-lavender-600 font-medium">Precious Gems</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Energy Bar */}
            {/* Energy card with refined teal */}
            <Card className="glass-card border-2 border-teal-200/50 min-w-[240px] shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5" style={{ color: "#b2dfdb" }} />
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={(gameState.resources.energy / gameState.resources.maxEnergy) * 100}
                      className="h-3"
                      style={{ backgroundColor: "#b2dfdb" }}
                    />
                    <div className="text-xs text-center mt-2 font-medium" style={{ color: "#2e3d49" }}>
                      {gameState.resources.energy}/{gameState.resources.maxEnergy} Energy
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level Progress */}
            <Card className="glass-card border-2 border-sage-200/50 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Badge className="gradient-sage text-white px-3 py-1 rounded-xl">Lv.{gameState.player.level}</Badge>
                  <div className="w-24">
                    <Progress
                      value={(gameState.player.xp / gameState.player.maxXp) * 100}
                      className="h-3 bg-sage-100"
                    />
                    <div className="text-xs text-center mt-2 font-medium text-sage-700">
                      {gameState.player.xp}/{gameState.player.maxXp}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Farm Stats */}
          {/* <Card className="absolute top-24 right-6 glass-card border-2 border-sage-200/50 z-10 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-sage-800">
                <TreePine className="w-5 h-5 text-sage-600" />
                Farm Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sage-600">
                    <div className="w-3 h-3 bg-amber-400 rounded-full" />
                    Owned Land:
                  </span>
                  <span className="font-bold text-sage-800">{stats.ownedLand}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sage-600">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    Growing:
                  </span>
                  <span className="font-bold text-sage-800">{stats.growingCrops}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sage-600">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                    Ready:
                  </span>
                  <span className="font-bold text-emerald-600">{stats.readyCrops}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sage-600">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    Money Trees:
                  </span>
                  <span className="font-bold text-yellow-600">{stats.moneyTrees}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sage-600">
                    <div className="w-3 h-3 bg-green-600 rounded-full" />
                    Trees:
                  </span>
                  <span className="font-bold text-green-600">{stats.plantedTrees}</span>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Tools Panel */}
          <div className="absolute top-40 left-6 z-10">
            <Card className="glass-card border-2 border-sage-200/50 max-w-sm shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-center text-sage-800 flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400" />
                  Farming Tools
                </CardTitle>
                {/* <p className="text-sm text-center text-sage-600 font-medium">
                  Choose your tool, then interact with the world!
                </p> */}
              </CardHeader>
              <CardContent className="p-4  overflow-y-auto">
                <div className="space-y-4 overflow-y-auto">
                  {tools.map((tool) => {
                    const Icon = tool.icon
                    const isSelected = selectedTool === tool.id
                    const canAfford = !tool.cost || gameState.resources.gold >= tool.cost

                    return (
                      <div key={tool.id} className="flex overflow-y-auto items-center gap-4">
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="lg"
                          onClick={() => setSelectedTool(tool.id)}
                          disabled={!canAfford}
                          className={`w-12 h-12 p-0 rounded-2xl shadow-md transition-all duration-300 ${
                            isSelected
                              ? `gradient-teal text-white border-0 shadow-lg scale-110 dreamy-bloom`
                              : "bg-white/80 border-sage-200 hover:bg-teal-50"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </Button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sage-800">{tool.description}</span>
                            {tool.cost && (
                              <Badge className="bg-cream-200 text-cream-800 text-xs px-2 py-1 rounded-lg">
                                {tool.cost}g
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* <div className="mt-24 p-4 bg-gradient-to-br from-lavender-50 to-lavender-100 rounded-2xl border border-lavender-200/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-lavender-600" />
                      <span className="font-semibold text-lavender-800">Pro Tips!</span>
                    </div>
                    <div className="text-xs text-lavender-700 leading-relaxed">
                      Plant trees to beautify your farm! Each tree type has unique benefits and visual appeal.
                    </div>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Status */}
          <div className="absolute bottom-40 left-6 z-10">
            <Card className="glass-card border-2 border-emerald-200/50 shadow-lg">
              <CardContent className="p-4">
                <div className="text-sm">
                  <div className="font-semibold text-emerald-700 mb-1">Currently Active:</div>
                  <div className="text-sage-700 leading-relaxed">
                    {/* {selectedTool === "move" && "🌟 Explore Mode - Use WASD keys to wander your farm"} */}
                    {selectedTool === "buy" && "🌱 Land Claiming - Click empty tiles to claim them (20g)"}
                    {selectedTool === "plant" && "🌿 Seed Planting - Click your land to plant crops (10g)"}
                    {selectedTool === "tree" && "🌲 Tree Planting - Click your land to plant beautiful trees (15g+)"}
                    {selectedTool === "harvest" && "✨ Harvesting - Click mature crops to gather rewards"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Display */}
          {message && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 animate-float-up">
              <Card className={`${getMessageStyling()} border-2 shadow-xl max-w-md`}>
                <CardContent className="p-6 text-center">
                  <div className="font-bold text-lg leading-relaxed">{message.text}</div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Bottom Navigation - Always visible */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="glass-card border-2 border-sage-200/50 shadow-lg">
          <CardContent className="p-3">
            <div className="flex gap-3">
              {navigationItems.map(({ screen, icon: Icon, label, activeClass, inactiveClass }) => (
                <Button
                  key={screen}
                  variant={currentScreen === screen ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentScreen(screen)}
                  className={`flex flex-col items-center gap-1 h-auto py-3 px-4 rounded-2xl transition-all duration-200 ${
                    currentScreen === screen ? activeClass : inactiveClass
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Side Navigation */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10">
        <Card className="glass-card border-2 border-sage-200/50 shadow-lg">
          <CardContent className="p-3">
            <div className="flex flex-col gap-3">
              {sideNavigationItems.map(({ screen, icon: Icon, activeClass, inactiveClass }) => (
                <Button
                  key={screen}
                  variant={currentScreen === screen ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentScreen(screen)}
                  className={`w-12 h-12 p-0 rounded-2xl transition-all duration-200 ${
                    currentScreen === screen ? activeClass : inactiveClass
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mini Map */}
      {currentScreen === "dashboard" && (
        <div className="absolute bottom-6 right-6 z-10">
          <Card className="glass-card border-2 border-sage-200/50 shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Map className="w-4 h-4 text-sage-600" />
                <div className="w-20 h-20 bg-gradient-to-br from-sage-50 to-emerald-50 rounded-2xl border-2 border-sage-200 relative overflow-hidden">
                  {/* Player position */}
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-rose-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse shadow-sm"></div>
                  {/* Tile representations */}
                  {gameState.tiles.slice(0, 9).map((tile, i) => (
                    <div
                      key={tile.id}
                      className={`absolute w-1.5 h-1.5 rounded-full shadow-sm ${
                        tile.type === "empty"
                          ? "bg-sage-300"
                          : tile.type === "land"
                            ? "bg-amber-400"
                            : tile.type === "crop"
                              ? "bg-emerald-400"
                              : tile.type === "tree"
                                ? "bg-green-600"
                                : "bg-yellow-400"
                      }`}
                      style={{
                        left: `${(i % 3) * 25 + 15}%`,
                        top: `${Math.floor(i / 3) * 25 + 15}%`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
