import { NextRequest, NextResponse } from 'next/server'

// Mock del endpoint de listado de cuentas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userSecret = searchParams.get('userSecret')
    
    if (!userId || !userSecret) {
      return NextResponse.json(
        { error: 'userId y userSecret son requeridos' },
        { status: 400 }
      )
    }

    // Simular respuesta de SnapTrade con cuentas mock
    const mockResponse = {
      accounts: [
        {
          accountId: 'mock-account-1',
          broker: 'etrade',
          accountName: 'E*TRADE Account',
          status: 'connected',
          connectedAt: new Date().toISOString()
        },
        {
          accountId: 'mock-account-2',
          broker: 'fidelity',
          accountName: 'Fidelity 401k',
          status: 'connected',
          connectedAt: new Date(Date.now() - 86400000).toISOString() // 1 día atrás
        }
      ]
    }

    console.log('🔧 Mock: Cuentas obtenidas:', mockResponse.accounts.length)
    
    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('Error en mock list-accounts:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
