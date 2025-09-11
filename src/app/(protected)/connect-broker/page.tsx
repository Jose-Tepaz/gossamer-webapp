"use client"

import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useOnboarding } from "@/hooks/useOnboarding"
import { useBrokerConnections } from "@/hooks/useBrokerConnections"
import ConnectBroker from "@/components/layout/ConectBrocker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ConnectBrokerPage() {
  const router = useRouter()
  const { markBrokerConnected } = useOnboarding()
  const { connectedBrokers, isHydrated } = useBrokerConnections()
  const [showSuccess, setShowSuccess] = useState(false)
  const [connectedBroker, setConnectedBroker] = useState<string>('')

  const handleBrokerConnect = (brokerName: string) => {
    // Mark broker as connected in onboarding (if in onboarding flow)
    markBrokerConnected()
    
    // Show success state
    setConnectedBroker(brokerName)
    setShowSuccess(true)
    
    // Hide success after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }
  
  // const getBrokerId = (name: string): string => {
  //   const nameToId: Record<string, string> = {
  //     'Binance': 'binance',
  //     'Coinbase': 'coinbase',
  //     'Kraken': 'kraken',
  //     'Robinhood': 'robinhood'
  //   }
  //   return nameToId[name] || name.toLowerCase()
  // }

  const handleContinue = () => {
    // Check if user is in onboarding flow
    const onboardingProgress = localStorage.getItem('onboarding_progress')
    if (onboardingProgress) {
      // Return to onboarding
      router.push('/onboarding')
    } else {
      // Go to dashboard or broker management
      router.push('/dashboard')
    }
  }

  // Evitar problemas de hidratación
  if (!isHydrated) {
    return (
      <ProtectedRoute>
        <div className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/70" />
          <div className="relative z-10 min-h-screen p-4 flex items-center justify-center">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="ml-2 text-white">Loading...</span>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen overflow-hidden">
        {/* Fondo con viñeta */}
        <div className="absolute inset-0 bg-slate-900/70" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 600px at 50% 20%, rgba(255,255,255,0.15), rgba(0,0,0,0) 60%)",
            filter: "blur(10px)",
          }}
          aria-hidden="true"
        />
        
        {/* Contenido */}
        <div className="relative z-10 min-h-screen p-4 flex items-center justify-center">
          <div className="w-full max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => router.back()}
                  className="text-white hover:bg-white/10"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Connect Broker</h1>
                  <p className="text-white/70">Link your trading accounts to sync portfolios</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-white bg-primary border-white/20 hover:bg-white/10"
                onClick={() => router.push('/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Connections
              </Button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Connect Broker Component */}
              <div className="lg:col-span-2">
                <ConnectBroker 
                  onBrokerConnect={handleBrokerConnect}
                  showBackButton={false}
                  showContinueButton={true}
                  onContinue={handleContinue}
                />
              </div>

              {/* Sidebar Info */}
              <div className="space-y-4">
                              {/* Connected Brokers */}
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-white">Connected Brokers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {connectedBrokers.length === 0 ? (
                      <div className="text-center py-4 text-white/50">
                        No brokers connected yet
                      </div>
                    ) : (
                      connectedBrokers.map((brokerId) => (
                        <div key={brokerId} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                          <div>
                            <div className="font-medium">{brokerId}</div>
                            <div className="text-sm text-white/70">
                              Connected
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Success Message */}
              {showSuccess && (
                <Card className="bg-green-500/20 border-green-500/30 text-white animate-in slide-in-from-top-2">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <div>
                        <div className="font-medium">Success!</div>
                        <div className="text-sm text-white/80">
                          {connectedBroker} has been connected successfully
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

                {/* Benefits */}
                <Card className="bg-white/10 border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Why Connect Brokers?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                        <span>Automatic portfolio sync</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                        <span>Real-time balance updates</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                        <span>Unified view across brokers</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                        <span>Advanced analytics</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Info */}
                <Card className="bg-white/10 border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                        <span>Bank-level encryption</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                        <span>Read-only access</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                        <span>No trading permissions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
