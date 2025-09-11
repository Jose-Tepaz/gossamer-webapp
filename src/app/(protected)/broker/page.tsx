"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useBrokerConnections } from "@/hooks/useBrokerConnections"
import { Wallet, Landmark, Building2, Banknote, ArrowRight, Plus } from "lucide-react"

export default function BrokerPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { connectedBrokers } = useBrokerConnections()
  
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : "Guest"

  const getBrokerIcon = (brokerId: string) => {
    switch (brokerId) {
      case 'binance':
        return <Wallet className="h-8 w-8" />
      case 'coinbase':
        return <Landmark className="h-8 w-8" />
      case 'kraken':
        return <Building2 className="h-8 w-8" />
      case 'robinhood':
        return <Banknote className="h-8 w-8" />
      default:
        return <Wallet className="h-8 w-8" />
    }
  }

  return (
    <div>
      {/* Welcome card */}
      <Card
        className="flex items-center justify-between rounded-xl border bg-white mb-6"
        style={{ borderColor: "#eeeeee" }}
      >
        <div className="px-4 md:px-6 py-3 md:py-4 text-base md:text-lg font-semibold">
          Welcome {userName ?? "Joe Doe"}
        </div>
      </Card>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Brokers</h1>
          <p className="text-gray-600 mt-1">
            Manage your connected brokerage accounts and view portfolio data
          </p>
        </div>
        <Button 
          onClick={() => router.push('/connect-broker')}
          className="gap-2"
          style={{ backgroundColor: "#872eec" }}
        >
          <Plus className="h-4 w-4" />
          Connect Broker
        </Button>
      </div>

      {/* Connected Brokers */}
      {connectedBrokers.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <div className="rounded-full bg-gray-100 p-4">
              <Wallet className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">No Brokers Connected</h2>
          <p className="text-gray-600 mb-6">
            Connect your first broker to start managing your portfolio and view trading data.
          </p>
          <Button 
            onClick={() => router.push('/connect-broker')}
            size="lg"
            style={{ backgroundColor: "#872eec" }}
          >
            Connect Your First Broker
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectedBrokers.map((brokerId) => (
            <Card 
              key={brokerId} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/broker/${brokerId}`)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    {getBrokerIcon(brokerId)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{brokerId.charAt(0).toUpperCase() + brokerId.slice(1)}</CardTitle>
                    <p className="text-sm text-gray-500">
                      Connected broker
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">View Portfolio</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {connectedBrokers.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => router.push('/connect-broker')}
            >
              <Plus className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Connect Another Broker</div>
                <div className="text-sm text-gray-500">Add more trading accounts</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => router.push('/models')}
            >
              <Wallet className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Manage Models</div>
                <div className="text-sm text-gray-500">Create and edit portfolios</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => router.push('/settings')}
            >
              <Building2 className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Broker Settings</div>
                <div className="text-sm text-gray-500">Configure connections</div>
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
