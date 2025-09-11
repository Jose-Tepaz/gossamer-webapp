import { useState } from 'react'

export const useSupabase = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeQuery = async (query: () => Promise<unknown>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await query()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error en consulta de Supabase:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  return { 
    executeQuery, 
    loading, 
    error, 
    clearError 
  }
}
