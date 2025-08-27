"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface MemberstackUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  planType?: string
}

export function useMemberstack() {
  const [user, setUser] = useState<MemberstackUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simular carga de usuario desde Memberstack
    // En producción, aquí usarías la API de Memberstack
    const loadUser = async () => {
      try {
        // Simular delay de carga
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Verificar si hay sesión en localStorage (simulación)
        const sessionData = localStorage.getItem("memberstack-session")
        if (sessionData) {
          const userData = JSON.parse(sessionData)
          setUser(userData)
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string) => {
    try {
      // Simular login con Memberstack
      // En producción, aquí usarías la API de Memberstack
      const userData = {
        id: "user-123",
        email,
        firstName: "Joe",
        lastName: "Doe",
        planType: "Pro"
      }
      
      localStorage.setItem("memberstack-session", JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error }
    }
  }

  const logout = async () => {
    try {
      // Simular logout con Memberstack
      // En producción, aquí usarías la API de Memberstack
      localStorage.removeItem("memberstack-session")
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      // Simular registro con Memberstack
      // En producción, aquí usarías la API de Memberstack
      const userData = {
        id: "user-" + Date.now(),
        email,
        firstName,
        lastName,
        planType: "Free"
      }
      
      localStorage.setItem("memberstack-session", JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (error) {
      console.error("Register error:", error)
      return { success: false, error }
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register
  }
}
