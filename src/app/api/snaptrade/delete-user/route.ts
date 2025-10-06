import { NextRequest, NextResponse } from 'next/server'
import { snapTradeService, SnapTradeError } from '@/lib/snaptrade-server'

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido para eliminar el usuario' },
        { status: 400 }
      )
    }

    console.log('📨 DELETE /api/snaptrade/delete-user - Iniciando...')

    const result = await snapTradeService.deleteUser(userId)
    
    console.log('✅ Usuario eliminado exitosamente')
    
    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('❌ Error en delete-user:', error)
    
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
            error: 'Usuario no encontrado',
            message: 'El usuario especificado no existe en SnapTrade',
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
      { error: 'Error al eliminar el usuario', message: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
