import { testSupabaseConnection, checkSupabaseConfig } from './supabase'
import { UserDataService } from './user-data-service'

// Función para probar todas las funcionalidades de Supabase
export const runSupabaseTests = async () => {
  console.log('🧪 Iniciando pruebas de Supabase...')

  try {
    // 0. Verificar configuración
    console.log('0️⃣ Verificando configuración...')
    const configOk = checkSupabaseConfig()
    if (!configOk) {
      throw new Error('❌ Configuración incorrecta')
    }
    console.log('✅ Configuración correcta')

    // 1. Probar conexión básica
    console.log('1️⃣ Probando conexión básica...')
    const connectionOk = await testSupabaseConnection()
    if (!connectionOk) {
      throw new Error('❌ Falló la conexión básica')
    }
    console.log('✅ Conexión básica exitosa')

    // 2. Probar creación de usuario de prueba
    console.log('2️⃣ Probando creación de usuario...')
    const testUser = {
      user_id: 'test-memberstack-id-123',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User'
    }

    // Verificar si el usuario ya existe
    const existingUser = await UserDataService.getUserByMemberstackId(testUser.user_id)
    if (existingUser) {
      console.log('ℹ️ Usuario de prueba ya existe, eliminándolo...')
      await UserDataService.deleteUser(testUser.user_id)
    }

    // Crear nuevo usuario
    const newUser = await UserDataService.createUser(testUser)
    console.log('✅ Usuario creado exitosamente:', newUser.id)

    // 3. Probar lectura de usuario
    console.log('3️⃣ Probando lectura de usuario...')
    const retrievedUser = await UserDataService.getUserByMemberstackId(testUser.user_id)
    if (!retrievedUser) {
      throw new Error('❌ No se pudo recuperar el usuario')
    }
    console.log('✅ Usuario recuperado exitosamente')

    // 4. Probar actualización de usuario
    console.log('4️⃣ Probando actualización de usuario...')
    const updatedUser = await UserDataService.updateUser(testUser.user_id, {
      user_secret: 'test-snaptrade-secret-456'
    })
    if (updatedUser.user_secret !== 'test-snaptrade-secret-456') {
      throw new Error('❌ La actualización no funcionó correctamente')
    }
    console.log('✅ Usuario actualizado exitosamente')

    // 5. Probar búsqueda por email
    console.log('5️⃣ Probando búsqueda por email...')
    const userByEmail = await UserDataService.getUserByEmail(testUser.email)
    if (!userByEmail) {
      throw new Error('❌ No se pudo encontrar el usuario por email')
    }
    console.log('✅ Búsqueda por email exitosa')

    // 6. Limpiar usuario de prueba
    console.log('6️⃣ Limpiando usuario de prueba...')
    await UserDataService.deleteUser(testUser.user_id)
    console.log('✅ Usuario de prueba eliminado')

    console.log('🎉 ¡Todas las pruebas de Supabase pasaron exitosamente!')
    return true

  } catch (error) {
    console.error('❌ Error en las pruebas de Supabase:', error)
    return false
  }
}

// Función para verificar la configuración (re-exportada desde supabase.ts)
export { checkSupabaseConfig } from './supabase'
