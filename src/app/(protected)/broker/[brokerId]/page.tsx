"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EllipsisVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/hooks/useAuth"
import { useBrokerConnections } from "@/hooks/useBrokerConnections"
import { useParams } from "next/navigation"

export default function BrokerPage() {
  const router = useRouter()
  const params = useParams()
  const brokerId = params.brokerId as string
  const [tab, setTab] = useState("overview")
  const { user } = useAuth()
  const { isConnected } = useBrokerConnections()

  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : "Guest"

  // Check if broker is connected
  if (!isConnected(brokerId)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Broker Not Connected</h2>
          <p className="text-gray-600 mb-6">
            This broker is not connected. Please connect it first to view its data.
          </p>
          <Button 
            onClick={() => router.push('/connect-broker')}
            style={{ backgroundColor: "#872eec" }}
          >
            Connect Broker
          </Button>
        </Card>
      </div>
    )
  }

  const getBrokerName = (id: string): string => {
    const brokerNames: Record<string, string> = {
      'binance': 'Binance',
      'coinbase': 'Coinbase',
      'kraken': 'Kraken',
      'robinhood': 'Robinhood'
    }
    return brokerNames[id] || id
  }

  const brokerName = getBrokerName(brokerId)

  return (
    <div>
      {/* Welcome card stays for context */}
      <Card
        className="flex items-center justify-between rounded-xl border bg-white"
        style={{ borderColor: "#eeeeee" }}
      >
        <div className="px-4 md:px-6 py-3 md:py-4 text-base md:text-lg font-semibold">
          Welcome {userName ?? "Joe Doe"}
        </div>
      </Card>

      {/* Tabs */}
      <div className="mt-4 md:mt-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-white p-1 rounded-lg border" style={{ borderColor: "#eeeeee" }}>
            <TabsTrigger
              value="overview"
              className="rounded-md data-[state=active]:text-white"
              style={{ backgroundColor: tab === "overview" ? "#872eec" : "transparent" }}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="trade"
              className="rounded-md data-[state=active]:text-white"
              style={{ backgroundColor: tab === "trade" ? "#872eec" : "transparent" }}
            >
              Trade
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-md data-[state=active]:text-white"
              style={{ backgroundColor: tab === "orders" ? "#872eec" : "transparent" }}
            >
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <SectionBroker brokerName={brokerName} brokerId={brokerId} />
          </TabsContent>
          <TabsContent value="trade" className="mt-4">
            <PlaceholderPanel title="Trade" />
          </TabsContent>
          <TabsContent value="orders" className="mt-4">
            <PlaceholderPanel title="Orders" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function PlaceholderPanel({ title = "Section" }: { title?: string }) {
  return (
    <Card className="rounded-xl border bg-white p-6" style={{ borderColor: "#eeeeee" }}>
      <p className="text-sm text-[#444444]">
        {"Esta es la pestaña de "}
        {title}
        {". Integraremos la lógica en pasos siguientes."}
      </p>
    </Card>
  )
}

function SectionBroker({ brokerName, brokerId }: { brokerName: string; brokerId: string }) {
  const getBrokerData = (id: string) => {
    // Mock data for different brokers
    const brokerData: Record<string, Array<{
      symbol: string
      units: string
      price: string
      value: string
      target: string
      real: string
      action: "buy" | "sell" | "none"
    }>> = {
      'binance': [
        { symbol: "Bitcoin", units: "180.308", price: "$106.811", value: "$103.86", target: "50%", real: "30%", action: "buy" },
        { symbol: "Ethereum", units: "0", price: "$1,500", value: "$0", target: "25%", real: "25%", action: "buy" },
        { symbol: "USDT", units: "1657.04", price: "$1", value: "$1,657", target: "0%", real: "25%", action: "none" },
        { symbol: "XRP", units: "180.308", price: "$2.35", value: "$424.43", target: "25%", real: "25%", action: "sell" }
      ],
      'coinbase': [
        { symbol: "Bitcoin", units: "0.5", price: "$45,000", value: "$22,500", target: "60%", real: "60%", action: "none" },
        { symbol: "Ethereum", units: "5.2", price: "$3,200", value: "$16,640", target: "30%", real: "30%", action: "none" },
        { symbol: "Litecoin", units: "25", price: "$150", value: "$3,750", target: "10%", real: "10%", action: "none" }
      ],
      'kraken': [
        { symbol: "Bitcoin", units: "2.1", price: "$44,500", value: "$93,450", target: "40%", real: "40%", action: "none" },
        { symbol: "Ethereum", units: "15.8", price: "$3,100", value: "$48,980", target: "35%", real: "35%", action: "none" },
        { symbol: "Cardano", units: "1000", price: "$0.45", value: "$450", target: "15%", real: "15%", action: "none" },
        { symbol: "Polkadot", units: "50", price: "$7.20", value: "$360", target: "10%", real: "10%", action: "none" }
      ],
      'robinhood': [
        { symbol: "Apple", units: "10", price: "$180", value: "$1,800", target: "30%", real: "30%", action: "none" },
        { symbol: "Tesla", units: "5", price: "$250", value: "$1,250", target: "25%", real: "25%", action: "none" },
        { symbol: "Amazon", units: "3", price: "$140", value: "$420", target: "20%", real: "20%", action: "none" },
        { symbol: "Google", units: "2", price: "$120", value: "$240", target: "15%", real: "15%", action: "none" },
        { symbol: "Microsoft", units: "4", price: "$300", value: "$1,200", target: "10%", real: "10%", action: "none" }
      ]
    }
    
    return brokerData[id] || brokerData['binance']
  }

  const data = getBrokerData(brokerId)

  return (
    <Card className="rounded-xl border bg-white" style={{ borderColor: "#eeeeee" }}>
      {/* Header */}
      <div className="flex items-start gap-2 px-4 md:px-6 pt-4 md:pt-5">
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold">{brokerName}</h2>
          <p className="text-sm text-[#444444] mt-1">
            {"Portfolio overview and trading data for "}{brokerName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="rounded-md" style={{ backgroundColor: "#872eec", color: "#ffffff" }}>
            <Link href="/models/edit">Edit Model</Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More">
                <EllipsisVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table (scrollable on mobile) */}
      <div className="px-2 md:px-4 pb-4 md:pb-6">
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Real</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                  <Row
                    key={index}
                    symbol={row.symbol}
                    units={row.units}
                    price={row.price}
                    value={row.value}
                    target={row.target}
                    real={row.real}
                    action={{ type: row.action as "buy" | "sell" | "none" }}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Card>
  )
}

function Row({
  symbol,
  units,
  price,
  value,
  target,
  real,
  action,
}: {
  symbol: string
  units: string
  price: string
  value: string
  target: string
  real: string
  action: { type: "buy" | "sell" | "none" }
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{symbol}</TableCell>
      <TableCell>{units}</TableCell>
      <TableCell>{price}</TableCell>
      <TableCell>{value}</TableCell>
      <TableCell className="font-medium" style={{ backgroundColor: "#b2d1ff" }}>
        {target}
      </TableCell>
      <TableCell className="font-medium" style={{ backgroundColor: "#d1ffbc" }}>
        {real}
      </TableCell>
      <TableCell className="text-right">
        {action.type === "buy" ? (
          <Button size="sm" className="rounded-md" style={{ backgroundColor: "#d1ffbc", color: "#064e3b" }}>
            Buy
          </Button>
        ) : action.type === "sell" ? (
          <Button size="sm" className="rounded-md" style={{ backgroundColor: "#ff8888", color: "#7f1d1d" }}>
            Sell
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            className="rounded-md"
            style={{ backgroundColor: "#d2c7c7", color: "#444444" }}
          >
            None
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}
