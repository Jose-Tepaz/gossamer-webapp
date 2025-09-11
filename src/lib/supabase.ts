/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Cliente para operaciones del lado del cliente
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Cliente para operaciones del servidor (con service role) - solo si está disponible
export const supabaseAdmin = supabaseServiceKey && supabaseUrl
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Función para verificar la configuración
export const checkSupabaseConfig = () => {
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Configuración incompleta de Supabase')
    return false
  }
  
  console.log('✅ Configuración de Supabase correcta')
  return true
}

// Función para probar la conexión
export const testSupabaseConnection = async () => {
  try {
    console.log('🧪 Probando conexión a Supabase...')
    
    // Verificar configuración primero
    if (!checkSupabaseConfig()) {
      return false
    }
    
    const { error } = await supabase!
      .from('user_data')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Error de conexión a Supabase:', error)
      return false
    }
    
    console.log('✅ Conexión a Supabase exitosa')
    return true
  } catch (err) {
    console.error('❌ Error de conexión a Supabase:', err)
    return false
  }
}
