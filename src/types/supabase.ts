export interface UserData {
  id: string
  user_id: string // ID de Memberstack
  email: string
  first_name: string | null
  last_name: string | null
  user_secret: string | null // ID de SnapTrade
  created_at: string
  updated_at: string
}

export interface CreateUserDataInput {
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  user_secret?: string
}

export interface UpdateUserDataInput {
  email?: string
  first_name?: string
  last_name?: string
  user_secret?: string
}

// Tipos para respuestas de Supabase
export interface SupabaseResponse<T> {
  data: T | null
  error: {
    message: string
    code?: string
    details?: string
  } | null
}

// Tipos para operaciones de base de datos
export interface DatabaseOperation {
  success: boolean
  data?: unknown
  error?: string
}
