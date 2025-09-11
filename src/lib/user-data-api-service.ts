import { UserData, CreateUserDataInput, UpdateUserDataInput } from '@/types/supabase'

/**
 * Servicio de datos de usuario que usa API routes
 * Esto permite usar el service role key de manera segura desde el cliente
 */
export class UserDataApiService {
  // Crear nuevo usuario
  static async createUser(data: CreateUserDataInput): Promise<UserData> {
    console.log('🔧 Creando usuario via API...')
    
    const response = await fetch('/api/supabase/user-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error creando usuario')
    }

    const result = await response.json()
    console.log('✅ Usuario creado via API:', result.data.id)
    return result.data
  }

  // Obtener usuario por ID de Memberstack
  static async getUserByMemberstackId(userId: string): Promise<UserData | null> {
    const response = await fetch(`/api/supabase/user-data?user_id=${encodeURIComponent(userId)}`, {
      method: 'GET',
    })

    if (!response.ok) {
      const errorData = await response.json()
      if (response.status === 400 && errorData.error.includes('PGRST116')) {
        // Usuario no encontrado
        return null
      }
      throw new Error(errorData.error || 'Error obteniendo usuario')
    }

    const result = await response.json()
    return result.data
  }

  // Actualizar usuario
  static async updateUser(userId: string, updates: UpdateUserDataInput): Promise<UserData> {
    console.log('🔧 Actualizando usuario via API...')
    
    const response = await fetch('/api/supabase/user-data', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, updates }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error actualizando usuario')
    }

    const result = await response.json()
    console.log('✅ Usuario actualizado via API:', result.data.id)
    return result.data
  }

  // Eliminar usuario
  static async deleteUser(userId: string): Promise<void> {
    console.log('🔧 Eliminando usuario via API...')
    
    const response = await fetch(`/api/supabase/user-data?user_id=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error eliminando usuario')
    }

    console.log('✅ Usuario eliminado via API')
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
