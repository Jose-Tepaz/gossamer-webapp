"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, FileText, Calendar, Filter, AlertCircle } from "lucide-react"
import { useSignalDocuments, type SignalDocument } from "@/hooks/useSignalDocuments"
import { supabase, checkSupabaseConfig } from "@/lib/supabase"
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

  // Use the custom hook to handle documents
  const {
    documents,
    filteredDocuments,
    loading,
    error,
    downloadDocument,
    downloadDocumentDirect,
    getDocumentUrl,
    getStats
  } = useSignalDocuments({
    searchTerm: searchTerm || undefined,
    category: selectedCategory || undefined,
    dateRange: selectedDateRange || undefined
  })

  const stats = getStats()

  // Debug function to test Supabase connection
  const testSupabaseConnection = async () => {
    console.log('🧪 Testing Supabase connection...')
    console.log('🔧 Supabase config check:', checkSupabaseConfig())
    console.log('🔗 Supabase client:', supabase)
    
    if (!supabase) {
      console.error('❌ Supabase client is null')
      return
    }

    try {
      // Test 1: Check if table exists
      console.log('🔍 Test 1: Checking if signal_documents table exists...')
      const { data: tableCheck, error: tableError } = await supabase
        .from('signal_documents')
        .select('id')
        .limit(1)
      
      console.log('📊 Table check result:', { tableCheck, tableError })

      // Test 2: Try to get count
      console.log('🔍 Test 2: Getting document count...')
      const { count, error: countError } = await supabase
        .from('signal_documents')
        .select('*', { count: 'exact', head: true })
      
      console.log('📊 Count result:', { count, countError })

      // Test 3: Try to get all data
      console.log('🔍 Test 3: Getting all documents...')
      const { data: allData, error: allError } = await supabase
        .from('signal_documents')
        .select('*')
        .limit(10)
      
      console.log('📊 All data result:', { allData, allError })

      // Test 4: Check user authentication
      console.log('🔍 Test 4: Checking user authentication...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log('📊 User auth result:', { user: user?.id, userError })

    } catch (err) {
      console.error('❌ Direct query error:', err)
    }
  }

  // Run test on component mount
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
      console.log('🔍 Attempting to download document:', document)
      
      // Try the main download method first
      try {
        await downloadDocument(document)
        console.log('✅ Download completed successfully')
      } catch (downloadError) {
        console.warn('⚠️ Main download failed, trying direct method:', downloadError)
        
        // Fallback to direct download
        try {
          await downloadDocumentDirect(document)
          console.log('✅ Direct download completed successfully')
        } catch (directError) {
          console.error('❌ Both download methods failed:', directError)
          throw directError
        }
      }
    } catch (error) {
      console.error('❌ Error downloading file:', error)
      alert(`Error downloading file: ${error}`)
    }
  }

  const handleView = async (document: SignalDocument) => {
    try {
      console.log('🔍 Attempting to view document:', document)
      
      // Extract filename from file_url (in case it contains full URL)
      let fileName = document.file_url
      
      // If file_url contains a full URL, extract just the filename
      if (fileName.includes('/')) {
        fileName = fileName.split('/').pop() || fileName
        // Decode URL encoding
        fileName = decodeURIComponent(fileName)
      }
      
      console.log('🔍 File processing:', {
        originalFileUrl: document.file_url,
        extractedFileName: fileName,
        documentFileName: document.file_name
      })
      
      // First, list all files in the bucket to see what's available
      if (!supabase) {
        console.error('❌ Supabase client not available')
        alert('Supabase client not configured')
        return
      }

      const { data: allFiles, error: listError } = await supabase.storage
        .from('signal-documents')
        .list('')
      
      console.log('📁 All files in bucket:', { allFiles, listError })
      
      // Check if our specific file exists
      const fileExists = allFiles?.some(file => file.name === fileName)
      console.log('🔍 File exists check:', { 
        lookingFor: fileName, 
        fileExists,
        availableFiles: allFiles?.map(f => f.name)
      })
      
      if (!fileExists) {
        console.error('❌ File not found in storage:', fileName)
        alert(`File "${document.file_name}" not found in storage. Available files: ${allFiles?.map(f => f.name).join(', ') || 'None'}`)
        return
      }
      
      // Get the public URL using the extracted filename
      const { data } = supabase!.storage
        .from('signal-documents')
        .getPublicUrl(fileName)
      
      console.log('🔗 Generated URL:', data.publicUrl)
      
      // Test the URL before opening
      try {
        const response = await fetch(data.publicUrl, { method: 'HEAD' })
        if (!response.ok) {
          console.error('❌ URL not accessible:', response.status, response.statusText)
          alert(`File is not accessible: ${response.statusText}`)
          return
        }
        console.log('✅ URL is accessible')
      } catch (fetchError) {
        console.error('❌ Error testing URL:', fetchError)
        alert(`Error accessing file: ${fetchError}`)
        return
      }
      
      window.open(data.publicUrl, '_blank')
    } catch (error) {
      console.error('❌ Error opening file:', error)
      alert(`Error opening file: ${error}`)
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Signals</h1>
        <p className="mt-2">
          Weekly documents and analysis to improve your trading decisions
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 text-black">
        <CardHeader>
          <CardTitle className=" flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search in titles and descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border-black/20 text-black placeholder:text-black/50"
              />
            </div>

            {/* Category */}
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

            {/* Date range */}
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

      

      {/* Document list */}
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

      {/* Statistics */}
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
