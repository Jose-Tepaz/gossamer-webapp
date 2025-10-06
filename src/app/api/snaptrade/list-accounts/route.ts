import { NextRequest, NextResponse } from 'next/server'
import { snapTradeService, SnapTradeError } from '@/lib/snaptrade-server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const userSecret = searchParams.get('userSecret')
    
    if (!userId || !userSecret) {
      return NextResponse.json(
        { error: 'userId y userSecret son requeridos como parámetros de consulta' },
        { status: 400 }
      )
    }

    console.log('📨 GET /api/snaptrade/list-accounts - Iniciando...')
    console.log('📋 Parámetros:', { userId, userSecret })

    const result = await snapTradeService.listAccounts(userId, userSecret)
    
    console.log('✅ Cuentas listadas exitosamente')
    
    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('❌ Error en list-accounts:', error)
    
    if (error instanceof SnapTradeError) {
      if (error.statusCode === 401) {
        return NextResponse.json(
          {
            error: 'Error de autenticación',
            message: 'Las credenciales proporcionadas no son válidas',
            details: error.details || {}
          },
          { status: 401 }
        )
      }

      return NextResponse.json(
        { 
          error: error instanceof Error ? error.message : 'Error desconocido',
          details: error.details
        },
        { status: error.statusCode }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al listar las cuentas', message: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
