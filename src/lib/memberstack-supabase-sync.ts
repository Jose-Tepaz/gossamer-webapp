/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/types/auth'
import { UserData, CreateUserDataInput } from '@/types/supabase'
import { snapTradeService } from './snaptrade-service'

/**
 * Sincroniza un usuario de Memberstack con Supabase
 * Esta función es completamente no bloqueante y no interfiere con Memberstack
 */
export async function syncUserWithSupabase(user: User): Promise<void> {
  try {
    // Verificar que Supabase esté configurado
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('🔍 Verificando configuración de Supabase...')
    console.log('Supabase URL:', supabaseUrl ? 'Configurada' : 'No configurada')
    console.log('Supabase Key:', supabaseKey ? 'Configurada' : 'No configurada')
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('🔍 Supabase no configurado - saltando sincronización')
      return
    }

    console.log('🔄 Iniciando sincronización con Supabase para:', user.email)

    // Importación dinámica para evitar errores si Supabase no está configurado
    // Usar API service para evitar problemas de RLS
    const { UserDataApiService } = await import('@/lib/user-data-api-service')
    
    // Verificar si el usuario ya existe en Supabase
    console.log('🔍 Verificando si el usuario ya existe en Supabase...')
    const existingUser = await UserDataApiService.getUserByMemberstackId(user.id)
    
    if (existingUser) {
      console.log('✅ Usuario ya existe en Supabase:', existingUser.id)
      return
    }
    
    console.log('ℹ️ Usuario no existe en Supabase, creando nuevo usuario...')

    // Crear usuario en Supabase
    const userData: CreateUserDataInput = {
      user_id: user.id,
      email: user.email,
      first_name: user.firstName || undefined,
      last_name: user.lastName || undefined,
      user_secret: undefined, // Se llenará cuando se conecte SnapTrade
    }

    console.log('📝 Datos del usuario a crear:', userData)
    const newUser = await UserDataApiService.createUser(userData)
    
    if (newUser) {
      console.log('✅ Usuario creado en Supabase:', newUser.id)
    } else {
      console.log('⚠️ No se pudo crear usuario en Supabase')
    }

  } catch (error) {
    // Log del error pero no lanzarlo - no debe interferir con Memberstack
    console.error('❌ Error en sincronización con Supabase:', error)
    
    // Log detallado para debugging
    if (typeof error === 'object' && error !== null) {
      try {
        console.error('Error details:', JSON.stringify(error, null, 2))
      } catch {
        console.error('Could not serialize error')
      }
    }
  }
}

/**
 * Actualiza un usuario en Supabase cuando cambia en Memberstack
 */
export async function updateUserInSupabase(user: User): Promise<void> {
  try {
    // Verificar que Supabase esté configurado
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('🔍 Supabase no configurado - saltando actualización')
      return
    }

    console.log('🔄 Actualizando usuario en Supabase:', user.email)

    // Importación dinámica
    const { UserDataApiService } = await import('@/lib/user-data-api-service')
    
    // Actualizar usuario en Supabase
    const updateData = {
      email: user.email,
      first_name: user.firstName || undefined,
      last_name: user.lastName || undefined,
    }

    const updatedUser = await UserDataApiService.updateUser(user.id, updateData as any)
    
    if (updatedUser) {
      console.log('✅ Usuario actualizado en Supabase:', updatedUser.id)
    } else {
      console.log('⚠️ No se pudo actualizar usuario en Supabase')
    }

  } catch (error) {
    console.error('❌ Error actualizando usuario en Supabase:', error)
  }
}

/**
 * Elimina un usuario de Supabase cuando se elimina de Memberstack
 */
export async function deleteUserFromSupabase(memberstackUserId: string): Promise<void> {
  try {
    // Verificar que Supabase esté configurado
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('🔍 Supabase no configurado - saltando eliminación')
      return
    }

    console.log('🔄 Eliminando usuario de Supabase:', memberstackUserId)

    // Importación dinámica
    const { UserDataApiService } = await import('@/lib/user-data-api-service')
    
    await UserDataApiService.deleteUser(memberstackUserId)
    console.log('✅ Usuario eliminado de Supabase')

  } catch (error) {
    console.error('❌ Error eliminando usuario de Supabase:', error)
  }
}

/**
 * Obtiene datos adicionales del usuario desde Supabase
 */
export async function getUserDataFromSupabase(memberstackUserId: string): Promise<UserData | null> {
  try {
    // Verificar que Supabase esté configurado
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('🔍 Supabase no configurado - no se pueden obtener datos')
      return null
    }

    // Importación dinámica
    const { UserDataApiService } = await import('@/lib/user-data-api-service')
    
    const userData = await UserDataApiService.getUserByMemberstackId(memberstackUserId)
    
    if (userData) {
      console.log('✅ Datos obtenidos de Supabase para:', userData.email)
    }
    
    return userData

  } catch (error) {
    console.error('❌ Error obteniendo datos de Supabase:', error)
    return null
  }
}

/**
 * Registra automáticamente al usuario en SnapTrade después del registro en Memberstack
 * Esta función se llama después de que el usuario se registra exitosamente
 */
export async function registerUserInSnapTrade(user: User): Promise<void> {
  try {
    console.log('🔄 Iniciando registro automático en SnapTrade para usuario:', user.id)
    
    // 1. Registrar usuario en SnapTrade
    const snapTradeUser = await snapTradeService.registerUser(user.id)
    console.log('✅ Usuario registrado en SnapTrade:', snapTradeUser)
    
    // 2. Guardar userSecret en Supabase
    console.log('🔄 Guardando userSecret en Supabase...')
    
    // Importación dinámica para evitar problemas de dependencias circulares
    const { UserDataApiService } = await import('./user-data-api-service')
    
    await UserDataApiService.updateUser(user.id, {
      user_secret: snapTradeUser.userSecret,
    })
    
    console.log('✅ UserSecret guardado en Supabase exitosamente')
    
  } catch (error) {
    console.error('❌ Error en registro automático de SnapTrade:', error)
    // No lanzamos el error para que no interfiera con el flujo principal
  }
}
