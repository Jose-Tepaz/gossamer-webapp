import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Obtener usuario por ID de Memberstack
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/supabase/user-data-fixed - Verificando configuración...');
    console.log('🔍 SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configurada' : 'No configurada');
    console.log('🔍 SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configurada' : 'No configurada');
    console.log('🔍 supabaseAdmin:', supabaseAdmin ? 'Disponible' : 'No disponible');
    
    if (!supabaseAdmin) {
      console.error('❌ Cliente de Supabase Admin no está configurado');
      return NextResponse.json(
        { error: 'Cliente de Supabase Admin no está configurado' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id es requerido' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error obteniendo usuario:', error)
      return NextResponse.json(
        { error: `Error obteniendo usuario: ${error.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error en GET /api/supabase/user-data-fixed:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
