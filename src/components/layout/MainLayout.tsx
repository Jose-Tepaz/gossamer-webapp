"use client"

import { usePathname } from "next/navigation"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { useAuth } from "@/hooks/useAuth"

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : "Guest"

  return (
    <div className="min-h-screen w-full bg-[#f4f4f4]">
      <Header 
        userName={userName}
        isLoggedIn={!!user}
        onLogout={logout}
      />

      <div className="flex">
        <Sidebar activePage={pathname} />
        
        <main className="flex-1">
          <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 md:pt-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 