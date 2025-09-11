import { NextRequest, NextResponse } from 'next/server'

// Mock del endpoint de registro de usuario
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    // Simular respuesta de SnapTrade
    const mockResponse = {
      userId: userId,
      userSecret: `mock-secret-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    console.log('🔧 Mock: Usuario registrado:', mockResponse)
    
    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('Error en mock register-user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
