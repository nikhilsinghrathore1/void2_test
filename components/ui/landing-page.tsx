"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGame } from "@/components/context/game-context"
import { Play, Star, Users, Trophy } from "lucide-react"

export default function LandingPage() {
  const { setCurrentScreen } = useGame()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">🌟 Terron</h1>
          <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
            Build your floating farm empire in the sky! Grow crops, trade with friends, and rule the clouds one tile at
            a time.
          </p>

          <Button
            size="lg"
            onClick={() => setCurrentScreen("dashboard")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xl px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all"
          >
            <Play className="w-6 h-6 mr-2" />
            Play Now
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                Build & Grow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Create your floating farm with beautiful 3D tiles. Plant crops, build structures, and watch your empire
                grow!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-400" />
                Trade & Social
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Connect with friends, trade resources, and visit each other's floating realms in this social farming
                experience.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-green-400" />
                Compete & Earn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Complete challenges, earn achievements, and climb the leaderboards to become the ultimate sky farmer!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="flex justify-center gap-8 text-white/80">
          <div className="text-center">
            <div className="text-2xl font-bold">10K+</div>
            <div className="text-sm">Active Players</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">50+</div>
            <div className="text-sm">Crop Types</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">∞</div>
            <div className="text-sm">Possibilities</div>
          </div>
        </div>
      </div>
    </div>
  )
}
