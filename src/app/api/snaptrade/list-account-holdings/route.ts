import { NextRequest, NextResponse } from 'next/server'
import { snapTradeService, SnapTradeError } from '@/lib/snaptrade-server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const accountId = searchParams.get('accountId')
    const userId = searchParams.get('userId')
    const userSecret = searchParams.get('userSecret')
    
    if (!accountId || !userId || !userSecret) {
      return NextResponse.json(
        { error: 'accountId, userId y userSecret son requeridos como parámetros de consulta' },
        { status: 400 }
      )
    }

    console.log('📨 GET /api/snaptrade/list-account-holdings - Iniciando...')
    console.log('📋 Parámetros:', { accountId, userId, userSecret })

    const result = await snapTradeService.listAccountHoldings(accountId, userId, userSecret)
    
    console.log('✅ Holdings listados exitosamente')
    
    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('❌ Error en list-account-holdings:', error)
    
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

      if (error.statusCode === 404) {
        return NextResponse.json(
          {
            error: 'Cuenta no encontrada',
            message: 'La cuenta especificada no existe o no pertenece al usuario',
            details: error.details || {}
          },
          { status: 404 }
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
      { error: 'Error al listar las tenencias de la cuenta', message: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
