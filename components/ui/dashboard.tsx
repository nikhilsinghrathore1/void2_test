"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useGame } from "@/components/context/game-context"
import { TrendingUp, Target, Gift } from "lucide-react"

export default function Dashboard() {
  const { gameState, setCurrentScreen } = useGame()

  const completedAchievements = gameState.achievements.filter((a) => a.completed).length
  const totalAchievements = gameState.achievements.length

  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-20">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome back, {gameState.player.name}! 🌾</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-700">{gameState.resources.gold}</div>
                  <div className="text-sm text-yellow-600">Gold Coins</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-100 to-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">{gameState.resources.gems}</div>
                  <div className="text-sm text-blue-600">Gems</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-100 to-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {gameState.tiles.filter((t) => t.type !== "empty").length}
                  </div>
                  <div className="text-sm text-green-600">Owned Tiles</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-100 to-purple-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-700">{gameState.player.level}</div>
                  <div className="text-sm text-purple-600">Level</div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Level Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Level {gameState.player.level}</span>
                      <span>
                        {gameState.player.xp}/{gameState.player.maxXp} XP
                      </span>
                    </div>
                    <Progress value={(gameState.player.xp / gameState.player.maxXp) * 100} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <span>
                        {completedAchievements}/{totalAchievements}
                      </span>
                    </div>
                    <Progress value={(completedAchievements / totalAchievements) * 100} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button onClick={() => setCurrentScreen("build")} className="h-20 flex flex-col gap-2">
                    🏗️
                    <span>Build</span>
                  </Button>
                  <Button onClick={() => setCurrentScreen("farm")} className="h-20 flex flex-col gap-2">
                    🌱<span>Farm</span>
                  </Button>
                  <Button onClick={() => setCurrentScreen("marketplace")} className="h-20 flex flex-col gap-2">
                    🏪<span>Trade</span>
                  </Button>
                  <Button onClick={() => setCurrentScreen("store")} className="h-20 flex flex-col gap-2">
                    💎<span>Store</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {gameState.achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-gray-600">{achievement.description}</div>
                      </div>
                      <Badge variant={achievement.completed ? "default" : "secondary"}>
                        {achievement.completed ? "✓" : "○"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
