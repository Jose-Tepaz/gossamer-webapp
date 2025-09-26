import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { CreateUserDataInput, UpdateUserDataInput } from '@/types/supabase'

// Obtener usuario por ID de Memberstack
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/userdata - Iniciando...');
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    console.log('🔍 userId recibido:', userId);

    if (!userId) {
      console.log('❌ userId no proporcionado');
      return NextResponse.json(
        { error: 'user_id es requerido' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      console.error('❌ Cliente de Supabase Admin no está configurado');
      return NextResponse.json(
        { error: 'Cliente de Supabase Admin no está configurado' },
        { status: 500 }
      )
    }

    console.log('🔍 Consultando Supabase...');
    const { data, error } = await supabaseAdmin
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error obteniendo usuario:', error)
      return NextResponse.json(
        { error: `Error obteniendo usuario: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Datos obtenidos:', data ? 'Encontrado' : 'No encontrado');
    return NextResponse.json({ data })
    
  } catch (error) {
    console.error('❌ Error en GET /api/userdata:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Crear nuevo usuario
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/userdata - Iniciando...');
    
    const body = await request.json()
    const userData: CreateUserDataInput = body

    console.log('🔍 Datos del usuario a crear:', userData);

    if (!userData.user_id || !userData.email) {
      console.log('❌ user_id y email son requeridos');
      return NextResponse.json(
        { error: 'user_id y email son requeridos' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      console.error('❌ Cliente de Supabase Admin no está configurado');
      return NextResponse.json(
        { error: 'Cliente de Supabase Admin no está configurado' },
        { status: 500 }
      )
    }

    console.log('🔍 Creando usuario en Supabase...');
    const { data, error } = await supabaseAdmin
      .from('user_data')
      .insert([userData])
      .select()
      .single()

    if (error) {
      console.error('❌ Error creando usuario:', error)
      return NextResponse.json(
        { error: `Error creando usuario: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Usuario creado exitosamente:', data.id);
    return NextResponse.json({ data })
    
  } catch (error) {
    console.error('❌ Error en POST /api/userdata:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Actualizar usuario
export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 PUT /api/userdata - Iniciando...');
    
    const body = await request.json()
    const { userId, updates }: { userId: string; updates: UpdateUserDataInput } = body

    console.log('🔍 Actualizando usuario:', userId, 'con datos:', updates);

    if (!userId) {
      console.log('❌ userId es requerido');
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      console.error('❌ Cliente de Supabase Admin no está configurado');
      return NextResponse.json(
        { error: 'Cliente de Supabase Admin no está configurado' },
        { status: 500 }
      )
    }

    console.log('🔍 Actualizando usuario en Supabase...');
    const { data, error } = await supabaseAdmin
      .from('user_data')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('❌ Error actualizando usuario:', error)
      return NextResponse.json(
        { error: `Error actualizando usuario: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Usuario actualizado exitosamente:', data.id);
    return NextResponse.json({ data })
    
  } catch (error) {
    console.error('❌ Error en PUT /api/userdata:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Eliminar usuario
export async function DELETE(request: NextRequest) {
  try {
    console.log('🔍 DELETE /api/userdata - Iniciando...');
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    console.log('🔍 userId recibido:', userId);

    if (!userId) {
      console.log('❌ userId no proporcionado');
      return NextResponse.json(
        { error: 'user_id es requerido' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      console.error('❌ Cliente de Supabase Admin no está configurado');
      return NextResponse.json(
        { error: 'Cliente de Supabase Admin no está configurado' },
        { status: 500 }
      )
    }

    console.log('🔍 Eliminando usuario de Supabase...');
    const { error } = await supabaseAdmin
      .from('user_data')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('❌ Error eliminando usuario:', error)
      return NextResponse.json(
        { error: `Error eliminando usuario: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Usuario eliminado exitosamente');
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('❌ Error en DELETE /api/userdata:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

