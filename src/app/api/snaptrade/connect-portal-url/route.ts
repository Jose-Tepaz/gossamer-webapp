import { NextRequest, NextResponse } from 'next/server'
import { snapTradeService, SnapTradeError } from '@/lib/snaptrade-server'

export async function POST(request: NextRequest) {
  try {
    // Verificar variables de entorno
    console.log('🔧 Verificando variables de entorno:')
    console.log('CLIENT_ID:', process.env.CLIENT_ID ? '✅ Configurado' : '❌ No configurado')
    console.log('CONSUMER_SECRET:', process.env.CONSUMER_SECRET ? '✅ Configurado' : '❌ No configurado')
    
    const { userId, userSecret, broker, immediateRedirect, customRedirect } = await request.json()
    
    if (!userId || !userSecret) {
      return NextResponse.json(
        { error: 'userId y userSecret son requeridos' },
        { status: 400 }
      )
    }

    console.log('📨 POST /api/snaptrade/connect-portal-url - Iniciando...')
    console.log('📋 Parámetros recibidos:', { userId, userSecret, broker, immediateRedirect, customRedirect })

    console.log('🔄 Llamando a snapTradeService.connectPortalUrl...')
    const result = await snapTradeService.connectPortalUrl({
      userId,
      userSecret,
      broker,
      immediateRedirect,
      customRedirect,
    })
    
    console.log('✅ URL de conexión generada exitosamente')
    console.log('📋 Resultado:', result)
    
    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('❌ Error en connect-portal-url:', error)
    console.error('❌ Error completo:', JSON.stringify(error, null, 2))
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack available')
    
    if (error instanceof SnapTradeError) {
      if (error.statusCode === 401) {
        return NextResponse.json(
          {
            error: 'Error de autenticación',
            message: 'Las credenciales proporcionadas (userId o userSecret) no son válidas',
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
      { error: 'Error interno del servidor', message: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
