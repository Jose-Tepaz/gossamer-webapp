import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

export interface SignalDocument {
  id: string
  title: string
  category: string
  file_url: string
  file_name: string
  created_at: string
  description?: string
  file_size?: number
}

export interface SignalDocumentFilters {
  searchTerm?: string
  category?: string
  dateRange?: string
}

export const useSignalDocuments = (filters?: SignalDocumentFilters) => {
  const [documents, setDocuments] = useState<SignalDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar documentos desde Supabase
  const loadDocuments = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔍 Loading signal documents from Supabase...')
      
      // Verificar configuración de Supabase
      if (!supabase) {
        console.error('❌ Supabase client not initialized')
        setError('Supabase client not configured')
        return
      }

      const { data, error } = await supabase
        .from('signal_documents')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('📊 Supabase query result:', { data, error })

      if (error) {
        console.error('❌ Error loading documents:', error)
        setError(`Error loading documents: ${error.message}`)
        return
      }

      console.log('✅ Documents loaded successfully:', data?.length || 0, 'documents')
      setDocuments(data || [])
    } catch (err) {
      console.error('❌ Unexpected error:', err)
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar documentos usando useMemo para evitar re-renders innecesarios
  const filteredDocuments = useMemo(() => {
    if (!filters) return documents

    let filtered = [...documents]

    // Filtro por búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchLower) ||
        doc.description?.toLowerCase().includes(searchLower) ||
        doc.category.toLowerCase().includes(searchLower)
      )
    }

    // Filtro por categoría
    if (filters.category) {
      filtered = filtered.filter(doc => doc.category === filters.category)
    }

    // Filtro por rango de fechas
    if (filters.dateRange) {
      const now = new Date()
      let startDate: Date

      switch (filters.dateRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case 'quarter':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(0)
      }

      filtered = filtered.filter(doc => new Date(doc.created_at) >= startDate)
    }

    return filtered
  }, [documents, filters?.searchTerm, filters?.category, filters?.dateRange])

  // Cargar documentos al montar el componente
  useEffect(() => {
    loadDocuments()
  }, [])

  // Función para descargar un documento
  const downloadDocument = async (document: SignalDocument) => {
    try {
      // Extract filename from file_url (in case it contains full URL)
      let fileName = document.file_url
      
      // If file_url contains a full URL, extract just the filename
      if (fileName.includes('/')) {
        fileName = fileName.split('/').pop() || fileName
        // Decode URL encoding
        fileName = decodeURIComponent(fileName)
      }

      console.log('📥 Downloading file:', {
        originalFileUrl: document.file_url,
        extractedFileName: fileName,
        documentFileName: document.file_name
      })

      // First, check if the file exists
      const { data: fileData, error: checkError } = await supabase.storage
        .from('signal-documents')
        .download(fileName)

      if (checkError) {
        console.error('❌ File check error:', checkError)
        throw new Error(`File not found: ${checkError.message}`)
      }

      if (!fileData) {
        console.error('❌ No file data received')
        throw new Error('No file data received from storage')
      }

      console.log('✅ File data received, size:', fileData.size, 'bytes')

      // Create download link
      const url = URL.createObjectURL(fileData)
      const a = document.createElement('a')
      a.href = url
      a.download = document.file_name || fileName
      a.style.display = 'none'
      
      // Add to DOM, trigger download, then remove
      document.body.appendChild(a)
      console.log('🖱️ Triggering download for:', a.download)
      a.click()
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        console.log('✅ Download cleanup completed')
      }, 100)

      return true
    } catch (error) {
      console.error('❌ Download error:', error)
      throw error
    }
  }

  // Función para obtener URL pública de un documento
  const getDocumentUrl = (document: SignalDocument) => {
    // Extract filename from file_url (in case it contains full URL)
    let fileName = document.file_url
    
    // If file_url contains a full URL, extract just the filename
    if (fileName.includes('/')) {
      fileName = fileName.split('/').pop() || fileName
      // Decode URL encoding
      fileName = decodeURIComponent(fileName)
    }

    const { data } = supabase.storage
      .from('signal-documents')
      .getPublicUrl(fileName)
    
    return data.publicUrl
  }

  // Función para obtener estadísticas
  const getStats = () => {
    const totalDocuments = documents.length
    const categories = [...new Set(documents.map(doc => doc.category))]
    const latestDocument = documents.length > 0 ? documents[0] : null

    return {
      totalDocuments,
      categories,
      latestDocument,
      filteredCount: filteredDocuments.length
    }
  }

  // Función alternativa de descarga usando URL directa
  const downloadDocumentDirect = async (document: SignalDocument) => {
    try {
      const url = getDocumentUrl(document)
      console.log('📥 Direct download URL:', url)
      
      // Open in new tab and let browser handle download
      window.open(url, '_blank')
      return true
    } catch (error) {
      console.error('❌ Direct download error:', error)
      throw error
    }
  }

  return {
    documents,
    filteredDocuments,
    loading,
    error,
    loadDocuments,
    downloadDocument,
    downloadDocumentDirect,
    getDocumentUrl,
    getStats
  }
}
