import { supabaseAdmin } from './supabase'
import { UserData, CreateUserDataInput, UpdateUserDataInput } from '@/types/supabase'

/**
 * Servicio de datos de usuario que usa el service role key
 * Esto evita problemas de RLS y permite operaciones administrativas
 */
export class UserDataServiceAdmin {
  // Crear nuevo usuario usando service role
  static async createUser(data: CreateUserDataInput): Promise<UserData> {
    if (!supabaseAdmin) {
      throw new Error('Cliente de Supabase Admin no está configurado. Verifica SUPABASE_SERVICE_ROLE_KEY')
    }

    console.log('🔧 Creando usuario con service role...')
    const { data: userData, error } = await supabaseAdmin
      .from('user_data')
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error('❌ Error creando usuario con service role:', error)
      throw new Error(`Error creando usuario: ${error.message}`)
    }
    
    console.log('✅ Usuario creado con service role:', userData.id)
    return userData
  }

  // Obtener usuario por ID de Memberstack usando service role
  static async getUserByMemberstackId(userId: string): Promise<UserData | null> {
    if (!supabaseAdmin) {
      throw new Error('Cliente de Supabase Admin no está configurado')
    }

    const { data, error } = await supabaseAdmin
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error obteniendo usuario: ${error.message}`)
    }
    return data
  }

  // Actualizar usuario usando service role
  static async updateUser(userId: string, updates: UpdateUserDataInput): Promise<UserData> {
    if (!supabaseAdmin) {
      throw new Error('Cliente de Supabase Admin no está configurado')
    }

    const { data, error } = await supabaseAdmin
      .from('user_data')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Error actualizando usuario: ${error.message}`)
    }
    return data
  }

  // Eliminar usuario usando service role
  static async deleteUser(userId: string): Promise<void> {
    if (!supabaseAdmin) {
      throw new Error('Cliente de Supabase Admin no está configurado')
    }

    const { error } = await supabaseAdmin
      .from('user_data')
      .delete()
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Error eliminando usuario: ${error.message}`)
    }
  }
}
