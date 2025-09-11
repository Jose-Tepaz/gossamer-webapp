import { supabase } from './supabase'
import { UserData, CreateUserDataInput, UpdateUserDataInput } from '@/types/supabase'

export class UserDataService {
  // Crear nuevo usuario
  static async createUser(data: CreateUserDataInput): Promise<UserData> {
    if (!supabase) {
      throw new Error('Cliente de Supabase no está configurado')
    }

    const { data: userData, error } = await supabase
      .from('user_data')
      .insert([data])
      .select()
      .single()

    if (error) {
      throw new Error(`Error creando usuario: ${error.message}`)
    }
    return userData
  }

  // Obtener usuario por ID de Memberstack
  static async getUserByMemberstackId(userId: string): Promise<UserData | null> {
    if (!supabase) {
      throw new Error('Cliente de Supabase no está configurado')
    }

    const { data, error } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error obteniendo usuario: ${error.message}`)
    }
    return data
  }

  // Obtener usuario por email
  static async getUserByEmail(email: string): Promise<UserData | null> {
    if (!supabase) {
      throw new Error('Cliente de Supabase no está configurado')
    }

    const { data, error } = await supabase
      .from('user_data')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error obteniendo usuario por email: ${error.message}`)
    }
    return data
  }

  // Actualizar usuario
  static async updateUser(userId: string, updates: UpdateUserDataInput): Promise<UserData> {
    if (!supabase) {
      throw new Error('Cliente de Supabase no está configurado')
    }

    const { data, error } = await supabase
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

  // Actualizar user_secret (ID de SnapTrade)
  static async updateUserSecret(userId: string, userSecret: string): Promise<UserData> {
    return this.updateUser(userId, { user_secret: userSecret })
  }

  // Eliminar usuario
  static async deleteUser(userId: string): Promise<void> {
    if (!supabase) {
      throw new Error('Cliente de Supabase no está configurado')
    }

    const { error } = await supabase
      .from('user_data')
      .delete()
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Error eliminando usuario: ${error.message}`)
    }
  }

  // Obtener todos los usuarios (solo para administración)
  static async getAllUsers(): Promise<UserData[]> {
    if (!supabase) {
      throw new Error('Cliente de Supabase no está configurado')
    }

    const { data, error } = await supabase
      .from('user_data')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Error obteniendo usuarios: ${error.message}`)
    }
    return data || []
  }

  // Verificar si un usuario existe
  static async userExists(userId: string): Promise<boolean> {
    try {
      const user = await this.getUserByMemberstackId(userId)
      return user !== null
    } catch {
      return false
    }
  }
}
