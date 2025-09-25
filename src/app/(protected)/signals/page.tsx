/**
 * Página de Señales
 * 
 * Esta página muestra una lista de documentos semanales de señales y análisis para mejorar las decisiones de trading del usuario.
 * Permite filtrar los documentos por búsqueda, categoría y periodo de tiempo.
 * Los usuarios pueden ver o descargar los documentos directamente desde la interfaz.
 * 
 * Componentes principales:
 * - Filtros de búsqueda, categoría y periodo.
 * - Listado de documentos con información relevante.
 * - Acciones para ver o descargar cada documento.
 * - Estadísticas de documentos mostrados y última actualización.
 * 
 * Notas:
 * - Todos los logs de consola han sido eliminados para producción.
 * - Se utiliza Supabase para la gestión de documentos y almacenamiento.
 */

"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, FileText, Calendar, Filter, AlertCircle } from "lucide-react"
import { useSignalDocuments, type SignalDocument } from "@/hooks/useSignalDocuments"
import { supabase } from "@/lib/supabase"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const CATEGORIES = [
  'Crypto',
  'Multy-Asset', 
  'S&P 500',
  'ETF',
  'Mutual Fund',
  'Stock',
  'Bond',
  'Commodity',
  'Real Estate',
  'Cash'
]

export default function SignalsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedDateRange, setSelectedDateRange] = useState<string>('')

  // Hook personalizado para manejar documentos
  const {
    filteredDocuments,
    loading,
    error,
    downloadDocument,
    downloadDocumentDirect,
    getStats
  } = useSignalDocuments({
    searchTerm: searchTerm || undefined,
    category: selectedCategory || undefined,
    dateRange: selectedDateRange || undefined
  })

  const stats = getStats()

  // Función para probar la conexión a Supabase (sin logs)
  const testSupabaseConnection = async () => {
    if (!supabase) {
      return
    }

    try {
      await supabase
        .from('signal_documents')
        .select('id')
        .limit(1)

      await supabase
        .from('signal_documents')
        .select('*', { count: 'exact', head: true })

      await supabase
        .from('signal_documents')
        .select('*')
        .limit(10)

      await supabase.auth.getUser()
    } catch {
      // Silenciar errores en producción
    }
  }

  // Ejecutar test al montar el componente
  React.useEffect(() => {
    testSupabaseConnection()
  }, [])

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleDownload = async (document: SignalDocument) => {
    try {
      // Intentar el método principal de descarga
      try {
        await downloadDocument(document)
      } catch {
        // Si falla, intentar el método directo
        try {
          await downloadDocumentDirect(document)
        } catch (directError) {
          throw directError
        }
      }
    } catch (error) {
      alert(`Error descargando el archivo: ${error}`)
    }
  }

  const handleView = async (document: SignalDocument) => {
    try {
      // Extraer el nombre del archivo desde file_url
      let fileName = document.file_url

      if (fileName.includes('/')) {
        fileName = fileName.split('/').pop() || fileName
        fileName = decodeURIComponent(fileName)
      }

      // Listar archivos en el bucket
      if (!supabase) {
        alert('Supabase client no está configurado')
        return
      }

      const { data: allFiles } = await supabase.storage
        .from('signal-documents')
        .list('')

      const fileExists = allFiles?.some(file => file.name === fileName)

      if (!fileExists) {
        alert(`El archivo "${document.file_name}" no se encuentra en el almacenamiento. Archivos disponibles: ${allFiles?.map(f => f.name).join(', ') || 'Ninguno'}`)
        return
      }

      // Obtener la URL pública
      const { data } = supabase!.storage
        .from('signal-documents')
        .getPublicUrl(fileName)

      // Probar la URL antes de abrir
      try {
        const response = await fetch(data.publicUrl, { method: 'HEAD' })
        if (!response.ok) {
          alert(`El archivo no es accesible: ${response.statusText}`)
          return
        }
      } catch (fetchError) {
        alert(`Error accediendo al archivo: ${fetchError}`)
        return
      }

      window.open(data.publicUrl, '_blank')
    } catch (error) {
      alert(`Error abriendo el archivo: ${error}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Signals</h1>
          <p className="text-white/70 mt-2 text-black">
            Weekly documents and analysis to improve your trading decisions
          </p>
        </div>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="flex items-center gap-3 p-6">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <div>
              <h3 className="text-lg font-medium text-red-400">Error loading documents</h3>
              <p className="text-red-300/70">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold">Signals</h1>
        <p className="mt-2">
          Weekly documents and analysis to improve your trading decisions
        </p>
      </div>

      {/* Filtros */}
      <Card className="bg-white/5 text-black">
        <CardHeader>
          <CardTitle className=" flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search in titles and descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border-black/20 text-black placeholder:text-black/50"
              />
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <label className="text-sm font-medium ">Category</label>
              <Select value={selectedCategory || undefined} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
                <SelectTrigger className="bg-white/10 border-black/20 text-black">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Periodo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Period</label>
              <Select value={selectedDateRange || undefined} onValueChange={(value) => setSelectedDateRange(value === "all" ? "" : value)}>
                <SelectTrigger className="bg-white/10 border-black/20 text-black">
                  <SelectValue placeholder="All periods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All periods</SelectItem>
                  <SelectItem value="week">Last week</SelectItem>
                  <SelectItem value="month">Last month</SelectItem>
                  <SelectItem value="quarter">Last quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de documentos */}
      <div className="space-y-4">
        {filteredDocuments.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-white/50 mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">No documents found</h3>
              <p className="text-black/70 text-center">
                {searchTerm || selectedCategory || selectedDateRange
                  ? 'Try adjusting the search filters'
                  : 'There are no documents available yet. New documents will be uploaded weekly.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((document) => (
            <Card key={document.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-black">{document.title}</h3>
                      <Badge variant="secondary" className="bg-purple-600/20 text-black">
                        {document.category}
                      </Badge>
                    </div>
                    
                    {document.description && (
                      <p className="text-black/70">{document.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-black/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(document.created_at), 'dd MMM yyyy', { locale: es })}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {formatFileSize(document.file_size)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(document)}
                      className="bg-transparent border-black/20 text-black hover:bg-black/10"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document)}
                      className="bg-transparent border-black/20 text-black hover:bg-black/10"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Estadísticas */}
      {stats.totalDocuments > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-black/70">
                Showing {stats.filteredCount} of {stats.totalDocuments} documents
              </span>
              <span className="text-black/70">
                Last update: {stats.latestDocument ? format(new Date(stats.latestDocument.created_at), 'dd MMM yyyy', { locale: es }) : 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
