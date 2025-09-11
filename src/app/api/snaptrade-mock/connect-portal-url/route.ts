import { NextRequest, NextResponse } from 'next/server'

// Mock del endpoint de portal de conexión
export async function POST(request: NextRequest) {
  try {
    const { userId, userSecret, broker } = await request.json()
    
    if (!userId || !userSecret || !broker) {
      return NextResponse.json(
        { error: 'userId, userSecret y broker son requeridos' },
        { status: 400 }
      )
    }

    // Simular respuesta de SnapTrade
    const mockResponse = {
      redirectUri: {
        redirectURI: `https://app.snaptrade.com/mock-portal?userId=${userId}&broker=${broker}&sessionId=mock-session-${Date.now()}`,
        sessionId: `mock-session-${Date.now()}`
      }
    }

    console.log('🔧 Mock: Portal generado:', mockResponse)
    
    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('Error en mock connect-portal-url:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
