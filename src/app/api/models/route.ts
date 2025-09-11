import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente con service role para bypass RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface ModelAsset {
  symbol: string;
  target_percentage: number;
}

export interface UserModel {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_global: boolean;
  broker_id?: string;
  model_data: {
    assets: ModelAsset[];
  };
  created_at: string;
  updated_at: string;
}

// GET - Obtener todos los modelos del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const brokerId = searchParams.get('broker_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id es requerido' }, { status: 400 });
    }

    let query = supabaseAdmin
      .from('user_models')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Si se especifica broker_id, filtrar por broker o modelos globales
    if (brokerId) {
      query = query.or(`broker_id.eq.${brokerId},is_global.eq.true`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error obteniendo modelos:', error);
      return NextResponse.json({ error: 'Error obteniendo modelos' }, { status: 500 });
    }

    return NextResponse.json({ models: data || [] });

  } catch (error) {
    console.error('Error en GET /api/models:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear nuevo modelo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 Datos recibidos para crear modelo:', body);
    const { user_id, name, description, is_global, broker_id, model_data } = body;

    // Validaciones
    if (!user_id || !name || !model_data?.assets) {
      return NextResponse.json({ 
        error: 'user_id, name y model_data.assets son requeridos' 
      }, { status: 400 });
    }

    // Validar que los porcentajes sumen 100%
    const totalPercentage = model_data.assets.reduce((sum: number, asset: ModelAsset) => 
      sum + (asset.target_percentage || 0), 0
    );

    if (Math.abs(totalPercentage - 100) > 0.01) { // Tolerancia de 0.01%
      return NextResponse.json({ 
        error: 'Los porcentajes deben sumar exactamente 100%' 
      }, { status: 400 });
    }

    // Validar que no excedan 100%
    if (totalPercentage > 100) {
      return NextResponse.json({ 
        error: 'Los porcentajes no pueden exceder 100%' 
      }, { status: 400 });
    }

    const insertData = {
      user_id,
      name,
      description,
      is_global: is_global || false,
      broker_id: is_global ? null : broker_id,
      model_data
    };
    
    console.log('💾 Insertando modelo en Supabase:', insertData);
    
    // Verificar que la tabla existe y tiene las columnas correctas
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'user_models');
    
    if (tableError) {
      console.error('❌ Error verificando estructura de tabla:', tableError);
    } else {
      console.log('📋 Estructura de tabla user_models:', tableInfo);
    }
    
    const { data, error } = await supabaseAdmin
      .from('user_models')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creando modelo:', error);
      console.error('❌ Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return NextResponse.json({ 
        error: 'Error creando modelo',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ model: data }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/models:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
