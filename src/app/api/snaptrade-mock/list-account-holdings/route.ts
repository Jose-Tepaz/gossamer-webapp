import { NextRequest, NextResponse } from 'next/server'

// Mock del endpoint de holdings de cuenta
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')
    const userId = searchParams.get('userId')
    const userSecret = searchParams.get('userSecret')
    
    if (!accountId || !userId || !userSecret) {
      return NextResponse.json(
        { error: 'accountId, userId y userSecret son requeridos' },
        { status: 400 }
      )
    }

    // Simular respuesta de SnapTrade con holdings mock
    const mockResponse = {
      accountId: accountId,
      balances: [
        {
          currency: 'USD',
          amount: 12500.50,
          type: 'cash'
        },
        {
          currency: 'USD',
          amount: 45000.75,
          type: 'invested'
        }
      ],
      positions: [
        {
          symbol: 'AAPL',
          quantity: 10,
          marketValue: 1500.00,
          costBasis: 1400.00
        },
        {
          symbol: 'GOOGL',
          quantity: 5,
          marketValue: 7500.00,
          costBasis: 7200.00
        },
        {
          symbol: 'TSLA',
          quantity: 2,
          marketValue: 400.00,
          costBasis: 380.00
        }
      ],
      orders: [
        {
          orderId: 'mock-order-1',
          symbol: 'AAPL',
          side: 'buy',
          quantity: 5,
          status: 'filled',
          createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hora atrás
        },
        {
          orderId: 'mock-order-2',
          symbol: 'GOOGL',
          side: 'sell',
          quantity: 2,
          status: 'pending',
          createdAt: new Date(Date.now() - 1800000).toISOString() // 30 minutos atrás
        }
      ]
    }

    console.log('🔧 Mock: Holdings obtenidos para cuenta:', accountId)
    
    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('Error en mock list-account-holdings:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
