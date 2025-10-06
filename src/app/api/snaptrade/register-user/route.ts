import { NextRequest, NextResponse } from 'next/server'
import { snapTradeService, SnapTradeError } from '@/lib/snaptrade-server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    console.log('📨 POST /api/snaptrade/register-user - Iniciando...')
    console.log('Body recibido:', { userId })

    const result = await snapTradeService.registerUser(userId)
    
    console.log('✅ Usuario registrado exitosamente:', result)
    
    // El backend devuelve directamente { userId, userSecret }
    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('❌ Error en register-user:', error)
    
    if (error instanceof SnapTradeError) {
      return NextResponse.json(
        { 
          error: true,
          message: error instanceof Error ? error.message : 'Error desconocido',
          details: error.details,
          snaptradeError: true,
          fullError: error.toString()
        },
        { status: error.statusCode }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
