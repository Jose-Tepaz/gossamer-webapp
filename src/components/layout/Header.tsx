"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Bell, Menu, LogOut, ArrowRight } from "lucide-react"
import Sidebar from "./Sidebar"
import { useAuth } from "@/hooks/useAuth"
import { usePathname, useRouter } from "next/navigation"

interface HeaderProps {
  userName?: string
  isLoggedIn?: boolean
  onLogout?: () => void
}

function MobileNav({ isLoggedIn, onLogout }: HeaderProps) {
  const pathname = usePathname()  
  const { logout } = useAuth()
  
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      logout()
    }
  }

  return (
    <header className="md:hidden sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex items-center gap-2 px-4 h-14">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]" style={{ backgroundColor: "#010824" }}>
            <SheetHeader className="px-5 pt-6 pb-3">
              <SheetTitle className="text-white">GOSSAMER</SheetTitle>
            </SheetHeader>
            <div className="px-3 pb-4">
              <Sidebar activePage={pathname} />
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="w-full mt-3 flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/80 hover:text-white"
                >
                  <span className="flex size-6 rounded-md items-center justify-center bg-white/5" aria-hidden="true">
                    <LogOut className="h-4 w-4" />
                  </span>
                  <span>Logout</span>
                </button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <div className="ml-1 text-base font-semibold">GOSSAMER</div>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          {isLoggedIn && (
            <Button variant="ghost" size="icon" aria-label="Logout" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

function DesktopTopbar({ userName, isLoggedIn, onLogout }: HeaderProps) {
  const { logout } = useAuth()
  const router = useRouter()
  
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      logout()
    }
  }

  return (
    <header className="hidden md:block fixed top-0 z-30 bg-white border-b md:left-64 lg:left-72 md:w-[calc(100%-16rem)] lg:w-[calc(100%-18rem)]">
      <div className="h-14 flex items-center px-6 lg:px-8 flex-row">
        <div className="text-sm text-muted-foreground">Welcome</div>
        <div className="ml-2 font-semibold">{userName || "Guest"}</div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2 text-white" style={{ backgroundColor: "#872eec" }}  aria-label="Connect broker" onClick={() => router.push("/connect-broker")}>
            Connect broker
            <ArrowRight className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          {isLoggedIn && (
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}

        </div>
      </div>
    </header>
  )
}

export default function Header({ userName, isLoggedIn, onLogout }: HeaderProps) {
  return (
    <>
      <MobileNav userName={userName} isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <DesktopTopbar userName={userName} isLoggedIn={isLoggedIn} onLogout={onLogout} />
    </>
  )
} 