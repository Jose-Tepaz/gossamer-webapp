import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/supabase/user-data-debug - Iniciando...');
    
    // Verificar configuración
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
    console.log('🔍 User ID recibido:', userId);

    if (!userId) {
      console.log('❌ user_id es requerido');
      return NextResponse.json(
        { error: 'user_id es requerido' },
        { status: 400 }
      )
    }

    console.log('🔍 Intentando consultar Supabase...');
    
    const { data, error } = await supabaseAdmin
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    console.log('🔍 Resultado de Supabase:', { data, error });

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error obteniendo usuario:', error);
      return NextResponse.json(
        { error: `Error obteniendo usuario: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Usuario obtenido exitosamente:', data);
    return NextResponse.json({ data })
    
  } catch (error) {
    console.error('❌ Error en GET /api/supabase/user-data-debug:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
