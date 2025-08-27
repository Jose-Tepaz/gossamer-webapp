"use client"

import type React from "react"
import Link from "next/link"
import {
  Home,
  Wallet,
  Landmark,
  Brain,
  BookOpen,
  LifeBuoy,
  Settings,
  Building2,
  Banknote,
} from "lucide-react"
import { useBrokerConnections } from "@/hooks/useBrokerConnections"

type NavItem = {
  label: string
  icon: React.ReactNode
  href: string
  active?: boolean
}

interface SidebarProps {
  activePage?: string
}

const getBrokerIcon = (brokerId: string) => {
  switch (brokerId) {
    case 'binance':
      return <Wallet className="h-4 w-4" />
    case 'coinbase':
      return <Landmark className="h-4 w-4" />
    case 'kraken':
      return <Building2 className="h-4 w-4" />
    case 'robinhood':
      return <Banknote className="h-4 w-4" />
    default:
      return <Wallet className="h-4 w-4" />
  }
}

const NAV_TOP: NavItem[] = [
  { label: "Home", icon: <Home className="h-4 w-4" />, href: "/dashboard" },
  { label: "My Models", icon: <Brain className="h-4 w-4" />, href: "/models" },
  { label: "Knowledge base", icon: <BookOpen className="h-4 w-4" />, href: "/knowledge-base" },
]

const NAV_BOTTOM: NavItem[] = [
  { label: "Support", icon: <LifeBuoy className="h-4 w-4" />, href: "/support" },
  { label: "Settings", icon: <Settings className="h-4 w-4" />, href: "/settings" },
]

export default function Sidebar({ activePage }: SidebarProps) {
  const { getConnectedBrokers } = useBrokerConnections()
  const connectedBrokers = getConnectedBrokers()
  
  const getActiveItem = (href: string) => {
    if (!activePage) return false
    return activePage === href || (activePage.startsWith('/broker') && href.startsWith('/broker'))
  }

  return (
    <aside
      className="hidden md:flex md:flex-col md:w-64 lg:w-72 h-screen sticky top-0 border-r"
      style={{ backgroundColor: "#010824", borderColor: "#0f1324" }}
      aria-label="Barra lateral de navegación"
    >
      <div className="px-5 pt-6 pb-4">
        <div className="text-xl font-bold tracking-wide" style={{ color: "#ffffff" }}>
          GOSSAMER
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {NAV_TOP.map((item) => {
          const isActive = getActiveItem(item.href)
          return (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                isActive ? "text-white" : "text-white/80 hover:text-white",
              ].join(" ")}
              style={{
                backgroundColor: isActive ? "#872eec" : "transparent",
              }}
            >
              <span
                className={["flex size-6 rounded-md items-center justify-center", isActive ? "" : "bg-white/5"].join(
                  " ",
                )}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
        
        {/* Connected Brokers */}
        {connectedBrokers.length > 0 && (
          <>
            <div className="pt-4 pb-2">
              <div className="text-xs font-medium text-white/50 uppercase tracking-wider">
                Connected Brokers
              </div>
            </div>
            {connectedBrokers.map((broker) => {
              // Solo marcar como activo el broker exacto en el que estoy
              const isActive = activePage === `/broker/${broker.id}`;
              return (
                <Link
                  key={broker.id}
                  href={`/broker/${broker.id}`}
                  className={[
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                    isActive ? "text-white" : "text-white/80 hover:text-white",
                  ].join(" ")}
                  style={{
                    backgroundColor: isActive ? "#872eec" : "transparent",
                  }}
                >
                  <span
                    className={["flex size-6 rounded-md items-center justify-center", isActive ? "" : "bg-white/5"].join(
                      " ",
                    )}
                    aria-hidden="true"
                  >
                    {getBrokerIcon(broker.id)}
                  </span>
                  <span>{broker.name}</span>
                </Link>
              )
            })}
          </>
        )}
      </nav>
      <div className="px-3 pb-6 space-y-1">
        {NAV_BOTTOM.map((item) => {
          const isActive = getActiveItem(item.href)
          return (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                isActive ? "text-white" : "text-white/80 hover:text-white",
              ].join(" ")}
              style={{
                backgroundColor: isActive ? "#872eec" : "transparent",
              }}
            >
              <span className="flex size-6 rounded-md items-center justify-center bg-white/5" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
} 