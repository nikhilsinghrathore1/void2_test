"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGame } from "@/components/context/game-context"
import { Volume2, Bell, Globe, Palette, Shield, Info } from "lucide-react"
import { useState } from "react"

export default function Settings() {
  const { setCurrentScreen } = useGame()
  const [settings, setSettings] = useState({
    musicVolume: 75,
    soundVolume: 85,
    notifications: true,
    language: "en",
    quality: "high",
    darkMode: false,
    autoSave: true,
  })

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-20">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">⚙️ Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Audio Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Audio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Music Volume</label>
                  <Slider
                    value={[settings.musicVolume]}
                    onValueChange={(value) => updateSetting("musicVolume", value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500 mt-1">{settings.musicVolume}%</div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sound Effects Volume</label>
                  <Slider
                    value={[settings.soundVolume]}
                    onValueChange={(value) => updateSetting("soundVolume", value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500 mt-1">{settings.soundVolume}%</div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-gray-600">Get notified about crops and events</div>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => updateSetting("notifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto Save</div>
                    <div className="text-sm text-gray-600">Automatically save your progress</div>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => updateSetting("autoSave", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Display
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Graphics Quality</label>
                  <Select value={settings.quality} onValueChange={(value) => updateSetting("quality", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="ultra">Ultra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Dark Mode</div>
                    <div className="text-sm text-gray-600">Use dark theme</div>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => updateSetting("darkMode", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Language */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Language & Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="ko">한국어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Account */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Link Google Account
                </Button>
                <Button variant="outline" className="w-full">
                  Link Apple Account
                </Button>
                <Button variant="outline" className="w-full">
                  Export Save Data
                </Button>
                <Button variant="destructive" className="w-full">
                  Reset Game Progress
                </Button>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold">Terron</div>
                  <div className="text-sm text-gray-600">Version 1.0.0</div>
                  <div className="text-sm text-gray-600">Build your floating farm empire!</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    Privacy Policy
                  </Button>
                  <Button variant="outline" size="sm">
                    Terms of Service
                  </Button>
                  <Button variant="outline" size="sm">
                    Credits
                  </Button>
                  <Button variant="outline" size="sm">
                    Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Settings */}
            <div className="flex gap-4">
              <Button onClick={() => setCurrentScreen("dashboard")} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setCurrentScreen("dashboard")} className="flex-1">
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
