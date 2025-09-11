import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Obtener modelo asignado a un broker
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Cliente de Supabase Admin no está configurado' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const brokerId = searchParams.get('broker_id')

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id es requerido' },
        { status: 400 }
      )
    }

    let query = supabaseAdmin
      .from('broker_models')
      .select(`
        *,
        user_models (*)
      `)
      .eq('user_id', userId)

    // Si se especifica brokerId, filtrar por ese broker
    if (brokerId) {
      query = query.eq('broker_id', brokerId)
    }

    const { data, error } = await query

    if (error && error.code !== 'PGRST116') {
      console.error('Error obteniendo modelo del broker:', error)
      return NextResponse.json(
        { error: `Error obteniendo modelo del broker: ${error.message}` },
        { status: 400 }
      )
    }

    // Si se especificó brokerId, devolver un solo modelo, sino devolver array
    if (brokerId) {
      return NextResponse.json({ data })
    } else {
      return NextResponse.json({ data: data || [] })
    }
  } catch (error) {
    console.error('Error en GET /api/broker-models:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Asignar modelo a un broker
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/broker-models - Asignando modelo');
    
    if (!supabaseAdmin) {
      console.error('❌ Supabase Admin no configurado');
      return NextResponse.json(
        { error: 'Cliente de Supabase Admin no está configurado' },
        { status: 500 }
      )
    }

    const { user_id, broker_id, model_id } = await request.json()
    console.log('📊 Datos recibidos:', { user_id, broker_id, model_id });

    if (!user_id || !broker_id || !model_id) {
      console.error('❌ Faltan parámetros requeridos');
      return NextResponse.json(
        { error: 'user_id, broker_id y model_id son requeridos' },
        { status: 400 }
      )
    }

    // Primero eliminar cualquier asignación existente para este broker
    console.log('🗑️ Eliminando asignaciones existentes...');
    const deleteResult = await supabaseAdmin
      .from('broker_models')
      .delete()
      .eq('user_id', user_id)
      .eq('broker_id', broker_id)
    
    console.log('🗑️ Resultado de eliminación:', deleteResult);

    // Crear nueva asignación
    console.log('➕ Creando nueva asignación...');
    const { data, error } = await supabaseAdmin
      .from('broker_models')
      .insert([{
        user_id,
        broker_id,
        model_id,
        assigned_at: new Date().toISOString()
      }])
      .select(`
        *,
        user_models (*)
      `)
      .single()

    if (error) {
      console.error('❌ Error asignando modelo al broker:', error)
      return NextResponse.json(
        { error: `Error asignando modelo al broker: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Asignación creada exitosamente:', data);
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error en POST /api/broker-models:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Desasignar modelo de un broker
export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Cliente de Supabase Admin no está configurado' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const brokerId = searchParams.get('broker_id')

    if (!userId || !brokerId) {
      return NextResponse.json(
        { error: 'user_id y broker_id son requeridos' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('broker_models')
      .delete()
      .eq('user_id', userId)
      .eq('broker_id', brokerId)

    if (error) {
      console.error('Error desasignando modelo del broker:', error)
      return NextResponse.json(
        { error: `Error desasignando modelo del broker: ${error.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/broker-models:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
