import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🧪 Test endpoint funcionando');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test endpoint funcionando',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configurada' : 'No configurada',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configurada' : 'No configurada'
    })
  } catch (error) {
    console.error('Error en test endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
