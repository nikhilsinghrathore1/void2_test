"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useGame } from "@/components/context/game-context"
import { Trophy, Star, Users, Edit } from "lucide-react"

export default function Profile() {
  const { gameState } = useGame()

  const completedAchievements = gameState.achievements.filter((a) => a.completed).length
  const totalAchievements = gameState.achievements.length

  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-20">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              👤 Player Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Player Info */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="text-2xl">{gameState.player.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-bold">{gameState.player.name}</h2>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        Level {gameState.player.level}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>XP Progress</span>
                          <span>
                            {gameState.player.xp}/{gameState.player.maxXp}
                          </span>
                        </div>
                        <Progress value={(gameState.player.xp / gameState.player.maxXp) * 100} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-yellow-50">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-2xl font-bold text-yellow-700">{gameState.resources.gold}</div>
                  <div className="text-sm text-yellow-600">Total Gold</div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">💎</div>
                  <div className="text-2xl font-bold text-blue-700">{gameState.resources.gems}</div>
                  <div className="text-sm text-blue-600">Gems Owned</div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">🏝️</div>
                  <div className="text-2xl font-bold text-green-700">
                    {gameState.tiles.filter((t) => t.type !== "empty").length}
                  </div>
                  <div className="text-sm text-green-600">Tiles Owned</div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-2xl font-bold text-purple-700">{completedAchievements}</div>
                  <div className="text-sm text-purple-600">Achievements</div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gameState.achievements.map((achievement) => (
                    <Card key={achievement.id} className={achievement.completed ? "bg-green-50" : "bg-gray-50"}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                achievement.completed ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                              }`}
                            >
                              {achievement.completed ? "✓" : "○"}
                            </div>
                            <div>
                              <div className="font-medium">{achievement.name}</div>
                              <div className="text-sm text-gray-600">{achievement.description}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={achievement.completed ? "default" : "secondary"}>
                              {achievement.reward}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Friends List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Friends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["SkyFarmer", "CloudGrower", "FloatMaster"].map((friend, index) => (
                    <Card key={friend} className="bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{["🧑‍🌾", "👩‍🌾", "🧙‍♂️"][index]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{friend}</div>
                              <div className="text-sm text-gray-600">Level {15 + index * 3}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Visit
                            </Button>
                            <Button size="sm" variant="outline">
                              Trade
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full">
                    Add Friends
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Customization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Customization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Avatar</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["🧑‍🌾", "👩‍🌾", "🧙‍♂️", "👨‍💼", "👩‍💼", "🧝‍♀️", "🧝‍♂️", "🧚‍♀️"].map((avatar) => (
                        <Button
                          key={avatar}
                          variant={gameState.player.avatar === avatar ? "default" : "outline"}
                          className="h-12 text-xl"
                        >
                          {avatar}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name Tag Color</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        "bg-blue-500",
                        "bg-green-500",
                        "bg-purple-500",
                        "bg-red-500",
                        "bg-yellow-500",
                        "bg-pink-500",
                        "bg-indigo-500",
                        "bg-gray-500",
                      ].map((color) => (
                        <Button key={color} variant="outline" className={`h-12 ${color}`}></Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
