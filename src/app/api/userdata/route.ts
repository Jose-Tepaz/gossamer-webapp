import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

