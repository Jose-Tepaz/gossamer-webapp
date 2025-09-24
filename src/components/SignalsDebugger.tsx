"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

interface DebugResult {
  test: string
  status: 'success' | 'error' | 'warning' | 'info'
  message: string
  data?: any
}

export default function SignalsDebugger() {
  const [results, setResults] = useState<DebugResult[]>([])
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    setResults([])
    const newResults: DebugResult[] = []

    try {
      // Test 1: Supabase client
      newResults.push({
        test: 'Supabase Client',
        status: supabase ? 'success' : 'error',
        message: supabase ? 'Client initialized correctly' : 'Client not initialized',
        data: supabase
      })

      if (!supabase) {
        setResults(newResults)
        setLoading(false)
        return
      }

      // Test 2: User authentication
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      newResults.push({
        test: 'User Authentication',
        status: user ? 'success' : 'warning',
        message: user ? `Authenticated as ${user.email}` : 'No authenticated user',
        data: { userId: user?.id, error: userError }
      })

      // Test 3: Table existence check
      try {
        const { data: tableCheck, error: tableError } = await supabase
          .from('signal_documents')
          .select('id')
          .limit(1)
        
        newResults.push({
          test: 'Table Access',
          status: tableError ? 'error' : 'success',
          message: tableError ? `Error accessing table: ${tableError.message}` : 'Table accessible',
          data: { error: tableError, sampleData: tableCheck }
        })
      } catch (err) {
        newResults.push({
          test: 'Table Access',
          status: 'error',
          message: `Exception accessing table: ${err}`,
          data: err
        })
      }

      // Test 4: Count query
      try {
        const { count, error: countError } = await supabase
          .from('signal_documents')
          .select('*', { count: 'exact', head: true })
        
        newResults.push({
          test: 'Document Count',
          status: countError ? 'error' : 'success',
          message: countError ? `Count error: ${countError.message}` : `Found ${count} documents`,
          data: { count, error: countError }
        })
      } catch (err) {
        newResults.push({
          test: 'Document Count',
          status: 'error',
          message: `Count exception: ${err}`,
          data: err
        })
      }

      // Test 5: Full data query
      try {
        const { data: allData, error: allError } = await supabase
          .from('signal_documents')
          .select('*')
          .limit(5)
        
        newResults.push({
          test: 'Data Retrieval',
          status: allError ? 'error' : allData?.length ? 'success' : 'warning',
          message: allError 
            ? `Data error: ${allError.message}` 
            : allData?.length 
              ? `Retrieved ${allData.length} documents` 
              : 'No documents found',
          data: { documents: allData, error: allError }
        })
      } catch (err) {
        newResults.push({
          test: 'Data Retrieval',
          status: 'error',
          message: `Data exception: ${err}`,
          data: err
        })
      }

      // Test 6: Storage bucket check
      try {
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
        const signalBucket = buckets?.find(bucket => bucket.id === 'signal-documents')
        
        newResults.push({
          test: 'Storage Bucket',
          status: bucketError ? 'error' : signalBucket ? 'success' : 'warning',
          message: bucketError 
            ? `Bucket error: ${bucketError.message}` 
            : signalBucket 
              ? 'signal-documents bucket exists' 
              : 'signal-documents bucket not found',
          data: { buckets, signalBucket, error: bucketError }
        })
      } catch (err) {
        newResults.push({
          test: 'Storage Bucket',
          status: 'error',
          message: `Bucket exception: ${err}`,
          data: err
        })
      }

      // Test 7: List files in storage bucket
      try {
        const { data: files, error: filesError } = await supabase.storage
          .from('signal-documents')
          .list('')
        
        newResults.push({
          test: 'Files in Storage',
          status: filesError ? 'error' : 'success',
          message: filesError 
            ? `Files error: ${filesError.message}` 
            : `Found ${files?.length || 0} files in storage`,
          data: { 
            files: files?.map(f => ({ name: f.name, size: f.metadata?.size })) || [],
            error: filesError 
          }
        })
      } catch (err) {
        newResults.push({
          test: 'Files in Storage',
          status: 'error',
          message: `Files exception: ${err}`,
          data: err
        })
      }

    } catch (err) {
      newResults.push({
        test: 'General Error',
        status: 'error',
        message: `Unexpected error: ${err}`,
        data: err
      })
    }

    setResults(newResults)
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500/20 text-green-400">Success</Badge>
      case 'error':
        return <Badge className="bg-red-500/20 text-red-400">Error</Badge>
      case 'warning':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Warning</Badge>
      default:
        return <Badge className="bg-blue-500/20 text-blue-400">Info</Badge>
    }
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-black flex items-center justify-between">
          <span>Signals Debugger</span>
          <Button 
            onClick={runDiagnostics} 
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? 'Running...' : 'Run Diagnostics'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.length === 0 ? (
          <p className="text-black/70">Click "Run Diagnostics" to test the Signals functionality</p>
        ) : (
          results.map((result, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-black font-medium">{result.test}</h4>
                  {getStatusBadge(result.status)}
                </div>
                <p className="text-black/70 text-sm">{result.message}</p>
                {result.data && (
                  <details className="mt-2">
                    <summary className="text-black/60 text-xs cursor-pointer">
                      Show Details
                    </summary>
                    <pre className="mt-2 text-xs bg-black/20 p-2 rounded overflow-auto text-black/80">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
