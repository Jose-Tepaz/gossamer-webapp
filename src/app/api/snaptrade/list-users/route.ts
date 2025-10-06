import { NextResponse } from 'next/server'
import { snapTradeService, SnapTradeError } from '@/lib/snaptrade-server'

export async function GET() {
  try {
    console.log('📨 GET /api/snaptrade/list-users - Iniciando...')

    const result = await snapTradeService.listUsers()
    
    console.log('✅ Usuarios listados exitosamente')
    
    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('❌ Error en list-users:', error)
    
    if (error instanceof SnapTradeError) {
      return NextResponse.json(
        { 
          error: error instanceof Error ? error.message : 'Error desconocido',
          details: error.details
        },
        { status: error.statusCode }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al listar usuarios', message: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
