/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// GET - Obtener modelo específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from('user_models')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error obteniendo modelo:', error);
      return NextResponse.json({ error: 'Modelo no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ model: data });

  } catch (error) {
    console.error('Error en GET /api/models/[id]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar modelo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, is_global, broker_id, model_data } = body;

    // Validar que los porcentajes sumen 100%
    if (model_data?.assets) {
      const totalPercentage = model_data.assets.reduce((sum: number, asset: any) => 
        sum + (asset.target_percentage || 0), 0
      );

      if (Math.abs(totalPercentage - 100) > 0.01) {
        return NextResponse.json({ 
          error: 'Los porcentajes deben sumar exactamente 100%' 
        }, { status: 400 });
      }

      if (totalPercentage > 100) {
        return NextResponse.json({ 
          error: 'Los porcentajes no pueden exceder 100%' 
        }, { status: 400 });
      }
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (is_global !== undefined) updateData.is_global = is_global;
    if (broker_id !== undefined) updateData.broker_id = is_global ? null : broker_id;
    if (model_data !== undefined) updateData.model_data = model_data;

    const { data, error } = await supabaseAdmin
      .from('user_models')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando modelo:', error);
      return NextResponse.json({ error: 'Error actualizando modelo' }, { status: 500 });
    }

    return NextResponse.json({ model: data });

  } catch (error) {
    console.error('Error en PUT /api/models/[id]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar modelo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('user_models')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando modelo:', error);
      return NextResponse.json({ error: 'Error eliminando modelo' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Modelo eliminado exitosamente' });

  } catch (error) {
    console.error('Error en DELETE /api/models/[id]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
