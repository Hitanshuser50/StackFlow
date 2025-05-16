"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LockIcon, UnlockIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ProFeatures() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [loginError, setLoginError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("premiumLoggedIn")
    const storedUsername = localStorage.getItem("premiumUsername")

    if (storedLoginStatus === "true" && storedUsername) {
      setIsLoggedIn(true)
      setUsername(storedUsername)
    }
  }, [])

  const handleLogin = () => {
    // For demo purposes, only accept "Hitansh Gopani" as the username
    if (username.toLowerCase() === "hitansh gopani") {
      setIsLoggedIn(true)
      setLoginError("")
      setDialogOpen(false)

      // Store login status in localStorage
      localStorage.setItem("premiumLoggedIn", "true")
      localStorage.setItem("premiumUsername", username)
    } else {
      setLoginError("Invalid username. Please try again.")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername("")

    // Clear login status from localStorage
    localStorage.removeItem("premiumLoggedIn")
    localStorage.removeItem("premiumUsername")
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      <Card className="bg-gradient-premium border-0 shadow-premium overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl md:text-3xl text-white flex items-center gap-2">
            {isLoggedIn ? (
              <UnlockIcon className="h-6 w-6 text-premium-pink" />
            ) : (
              <LockIcon className="h-6 w-6 text-premium-pink" />
            )}
            Premium Features
          </CardTitle>
          <CardDescription className="text-gray-300">
            {isLoggedIn
              ? `Welcome back, ${username}! Enjoy your premium access.`
              : "Unlock advanced tools and analytics with a premium account."}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-2">
          {isLoggedIn ? (
            <div className="space-y-4">
              <Alert className="bg-premium-dark-blue/50 border border-premium-purple/30">
                <CheckCircleIcon className="h-5 w-5 text-premium-purple" />
                <AlertTitle className="text-white">Premium Account Active</AlertTitle>
                <AlertDescription className="text-gray-300">
                  You have full access to all premium features.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FeatureCard
                  title="Advanced Analytics"
                  description="Deep insights into validator performance and stake flow patterns."
                  isLocked={false}
                />
                <FeatureCard
                  title="Real-time Alerts"
                  description="Get notified of important stake movements and validator changes."
                  isLocked={false}
                />
                <FeatureCard
                  title="Custom Reports"
                  description="Generate detailed reports on stake distribution and validator metrics."
                  isLocked={false}
                />
                <FeatureCard
                  title="API Access"
                  description="Programmatic access to all stake flow data and analytics."
                  isLocked={false}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className="bg-premium-dark-blue/50 border border-premium-pink/30">
                <XCircleIcon className="h-5 w-5 text-premium-pink" />
                <AlertTitle className="text-white">Premium Account Required</AlertTitle>
                <AlertDescription className="text-gray-300">Log in to access premium features.</AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FeatureCard
                  title="Advanced Analytics"
                  description="Deep insights into validator performance and stake flow patterns."
                  isLocked={true}
                />
                <FeatureCard
                  title="Real-time Alerts"
                  description="Get notified of important stake movements and validator changes."
                  isLocked={true}
                />
                <FeatureCard
                  title="Custom Reports"
                  description="Generate detailed reports on stake distribution and validator metrics."
                  isLocked={true}
                />
                <FeatureCard
                  title="API Access"
                  description="Programmatic access to all stake flow data and analytics."
                  isLocked={true}
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2">
          {isLoggedIn ? (
            <Button
              variant="outline"
              className="w-full bg-transparent border-premium-purple/50 text-white hover:bg-premium-purple/20"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          ) : (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-button hover:shadow-premium-hover transition-shadow duration-300">
                  Unlock Premium Features
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-premium border-0 shadow-premium">
                <DialogHeader>
                  <DialogTitle className="text-white">Premium Login</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Enter your username to access premium features.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="bg-premium-dark-blue/50 border-premium-purple/30 text-white"
                    />
                  </div>

                  {loginError && (
                    <Alert variant="destructive">
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    className="bg-gradient-button hover:shadow-premium-hover transition-shadow duration-300"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  isLocked: boolean
}

function FeatureCard({ title, description, isLocked }: FeatureCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border ${isLocked ? "border-premium-pink/20 bg-premium-dark-blue/30" : "border-premium-purple/20 bg-premium-dark-blue/30"}`}
    >
      <div className="flex items-start gap-3">
        {isLocked ? (
          <LockIcon className="h-5 w-5 text-premium-pink mt-0.5" />
        ) : (
          <CheckCircleIcon className="h-5 w-5 text-premium-purple mt-0.5" />
        )}
        <div>
          <h3 className="text-white font-medium">{title}</h3>
          <p className="text-gray-300 text-sm mt-1">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default ProFeatures
