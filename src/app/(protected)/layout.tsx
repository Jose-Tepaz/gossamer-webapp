"use client"

import ProtectedRoute from "@/components/auth/ProtectedRoute"
import MainLayout from "@/components/layout/MainLayout"
import { usePathname } from "next/navigation"

// Páginas que NO necesitan MainLayout (tienen su propio diseño)
const PAGES_WITHOUT_LAYOUT = [
  "/onboarding",
  "/connect-broker"
]

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Si la página está en la lista de páginas sin layout, solo aplicar ProtectedRoute
  if (PAGES_WITHOUT_LAYOUT.some(page => pathname?.startsWith(page))) {
    return (
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    )
  }

  // Para el resto de páginas, aplicar MainLayout
  return (
    <ProtectedRoute>
      <MainLayout>
        {children}
      </MainLayout>
    </ProtectedRoute>
  )
}
