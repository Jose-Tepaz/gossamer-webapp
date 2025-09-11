# 🗄️ Guía de Configuración de Supabase

## 📋 Contexto

Hemos migrado de Airtable a **Supabase** como nuestra base de datos principal. Supabase es una plataforma de backend-as-a-service que proporciona una base de datos PostgreSQL, autenticación, APIs en tiempo real y almacenamiento.

### Ventajas de Supabase sobre Airtable:
- ✅ Base de datos PostgreSQL robusta y escalable
- ✅ APIs REST y GraphQL automáticas
- ✅ Autenticación integrada (aunque usaremos Memberstack)
- ✅ Subscripciones en tiempo real
- ✅ Funciones Edge y triggers
- ✅ Mejor rendimiento para aplicaciones web
- ✅ SQL nativo para consultas complejas

---

## 🚀 Pasos para Configurar Supabase

### **PASO 1: Crear Proyecto en Supabase**

1. **Registrarse en Supabase**
   - Ir a [supabase.com](https://supabase.com)
   - Hacer clic en "Start your project"
   - Registrarse con GitHub, Google o email

2. **Crear Nuevo Proyecto**
   - Hacer clic en "New Project"
   - Seleccionar organización (o crear una nueva)
   - Configurar:
     - **Name**: `gossamer-financial-app`
     - **Database Password**: Generar una contraseña segura (guardarla)
     - **Region**: Seleccionar la más cercana (us-east-1 para América)
     - **Pricing Plan**: Free tier para empezar

3. **Esperar Configuración**
   - El proyecto tardará 2-3 minutos en configurarse
   - Una vez listo, acceder al dashboard del proyecto

### **PASO 2: Obtener Credenciales API**

1. **Acceder a Settings**
   - En el dashboard, ir a `Settings` → `API`

2. **Copiar Credenciales**
   ```
   Project URL: https://[project-id].supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Guardar en Variables de Entorno**
   - Agregar al archivo `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### **PASO 3: Instalar Dependencias**

```bash
# Instalar cliente de Supabase
npm install @supabase/supabase-js

# Los tipos de TypeScript vienen incluidos con @supabase/supabase-js
```

### **PASO 4: Configurar Cliente de Supabase**

1. **Crear archivo de configuración**
   - Crear `src/lib/supabase.ts`:
   ```typescript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

   export const supabase = createClient(supabaseUrl, supabaseAnonKey)

   // Cliente para operaciones del servidor (con service role)
   export const supabaseAdmin = createClient(
     supabaseUrl,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
   )
   ```

2. **Crear hook personalizado**
   - Crear `src/hooks/useSupabase.ts`:
   ```typescript
   import { supabase } from '@/lib/supabase'
   import { useState, useEffect } from 'react'

   export const useSupabase = () => {
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState<string | null>(null)

     const executeQuery = async (query: () => Promise<any>) => {
       setLoading(true)
       setError(null)
       try {
         const result = await query()
         return result
       } catch (err) {
         setError(err instanceof Error ? err.message : 'Error desconocido')
         throw err
       } finally {
         setLoading(false)
       }
     }

     return { executeQuery, loading, error }
   }
   ```

### **PASO 5: Crear Tabla user_data**

1. **Acceder al SQL Editor**
   - En el dashboard de Supabase, ir a `SQL Editor`
   - Hacer clic en "New query"

2. **Ejecutar Script de Creación**
   ```sql
   -- Crear tabla user_data
   CREATE TABLE user_data (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id TEXT NOT NULL UNIQUE, -- ID de Memberstack
     email TEXT NOT NULL,
     first_name TEXT,
     last_name TEXT,
     user_secret TEXT, -- ID de SnapTrade
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Crear índices para optimizar consultas
   CREATE INDEX idx_user_data_user_id ON user_data(user_id);
   CREATE INDEX idx_user_data_email ON user_data(email);

   -- Crear función para actualizar updated_at automáticamente
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ language 'plpgsql';

   -- Crear trigger para actualizar updated_at
   CREATE TRIGGER update_user_data_updated_at
     BEFORE UPDATE ON user_data
     FOR EACH ROW
     EXECUTE FUNCTION update_updated_at_column();

   -- Habilitar Row Level Security (RLS)
   ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

   -- Crear política para que los usuarios solo vean sus propios datos
   CREATE POLICY "Users can view own data" ON user_data
     FOR SELECT USING (auth.uid()::text = user_id);

   CREATE POLICY "Users can insert own data" ON user_data
     FOR INSERT WITH CHECK (auth.uid()::text = user_id);

   CREATE POLICY "Users can update own data" ON user_data
     FOR UPDATE USING (auth.uid()::text = user_id);
   ```

3. **Verificar Creación**
   - Ir a `Table Editor` en el dashboard
   - Verificar que la tabla `user_data` se creó correctamente
   - Verificar que los índices y triggers están activos

### **PASO 6: Crear Tipos de TypeScript**

1. **Crear archivo de tipos**
   - Crear `src/types/supabase.ts`:
   ```typescript
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
   ```

### **PASO 7: Crear Servicios de Base de Datos**

1. **Crear servicio para user_data**
   - Crear `src/lib/user-data-service.ts`:
   ```typescript
   import { supabase } from './supabase'
   import { UserData, CreateUserDataInput, UpdateUserDataInput } from '@/types/supabase'

   export class UserDataService {
     // Crear nuevo usuario
     static async createUser(data: CreateUserDataInput): Promise<UserData> {
       const { data: userData, error } = await supabase
         .from('user_data')
         .insert([data])
         .select()
         .single()

       if (error) throw new Error(`Error creando usuario: ${error.message}`)
       return userData
     }

     // Obtener usuario por ID de Memberstack
     static async getUserByMemberstackId(userId: string): Promise<UserData | null> {
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

     // Actualizar usuario
     static async updateUser(userId: string, updates: UpdateUserDataInput): Promise<UserData> {
       const { data, error } = await supabase
         .from('user_data')
         .update(updates)
         .eq('user_id', userId)
         .select()
         .single()

       if (error) throw new Error(`Error actualizando usuario: ${error.message}`)
       return data
     }

     // Eliminar usuario
     static async deleteUser(userId: string): Promise<void> {
       const { error } = await supabase
         .from('user_data')
         .delete()
         .eq('user_id', userId)

       if (error) throw new Error(`Error eliminando usuario: ${error.message}`)
     }
   }
   ```

### **PASO 8: Integrar con Memberstack**

1. **Modificar hook de autenticación**
   - Actualizar `src/hooks/useAuth.ts` para sincronizar con Supabase:
   ```typescript
   import { UserDataService } from '@/lib/user-data-service'
   import { useMemberstack } from '@/hooks/useMemberstack'

   export const useAuth = () => {
     const { user, loading } = useMemberstack()
     const [userData, setUserData] = useState<UserData | null>(null)

     useEffect(() => {
       if (user && !loading) {
         // Sincronizar datos de usuario con Supabase
         syncUserData()
       }
     }, [user, loading])

     const syncUserData = async () => {
       if (!user) return

       try {
         // Buscar usuario existente
         let existingUser = await UserDataService.getUserByMemberstackId(user.id)
         
         if (!existingUser) {
           // Crear nuevo usuario si no existe
           existingUser = await UserDataService.createUser({
             user_id: user.id,
             email: user.email,
             first_name: user.firstName,
             last_name: user.lastName
           })
         } else {
           // Actualizar datos si han cambiado
           const updates: UpdateUserDataInput = {}
           if (existingUser.email !== user.email) updates.email = user.email
           if (existingUser.first_name !== user.firstName) updates.first_name = user.firstName
           if (existingUser.last_name !== user.lastName) updates.last_name = user.lastName
           
           if (Object.keys(updates).length > 0) {
             existingUser = await UserDataService.updateUser(user.id, updates)
           }
         }

         setUserData(existingUser)
       } catch (error) {
         console.error('Error sincronizando datos de usuario:', error)
       }
     }

     return { user, userData, loading }
   }
   ```

### **PASO 9: Testing y Validación**

1. **Probar Conexión**
   ```typescript
   // Crear archivo de prueba: src/lib/test-supabase.ts
   import { supabase } from './supabase'

   export const testSupabaseConnection = async () => {
     try {
       const { data, error } = await supabase
         .from('user_data')
         .select('count')
         .limit(1)
       
       if (error) {
         console.error('Error de conexión:', error)
         return false
       }
       
       console.log('✅ Conexión a Supabase exitosa')
       return true
     } catch (err) {
       console.error('❌ Error de conexión:', err)
       return false
     }
   }
   ```

2. **Probar CRUD Operations**
   - Crear usuario de prueba
   - Leer datos
   - Actualizar datos
   - Eliminar datos

---

## 🔧 Configuración Adicional

### **Variables de Entorno Completas**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Memberstack
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=
MEMBERSTACK_SECRET_KEY=

# SnapTrade
NEXT_PUBLIC_SNAPTRADE_CLIENT_ID=
SNAPTRADE_CONSUMER_KEY=
SNAPTRADE_CONSUMER_SECRET=

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### **Estructura de Archivos Actualizada**
```
src/
├── lib/
│   ├── supabase.ts          # Cliente de Supabase
│   ├── user-data-service.ts # Servicios para user_data
│   └── ...
├── hooks/
│   ├── useSupabase.ts       # Hook personalizado
│   ├── useAuth.ts          # Actualizado para Supabase
│   └── ...
├── types/
│   ├── supabase.ts         # Tipos de Supabase
│   └── ...
└── ...
```

---

## 🎯 Próximos Pasos

1. **Completar configuración inicial** - Seguir todos los pasos anteriores
2. **Migrar datos existentes** - Si hay datos en Airtable, crear script de migración
3. **Implementar otras tablas** - Investment_Models, Portfolios, Transactions
4. **Configurar backups** - Configurar respaldos automáticos en Supabase
5. **Optimizar consultas** - Crear índices adicionales según necesidades
6. **Implementar real-time** - Usar subscripciones en tiempo real si es necesario

---

## 📚 Recursos Adicionales

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Guía de migración desde Airtable](https://supabase.com/docs/guides/migrations)
- [JavaScript SDK Reference](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

---

*Última actualización: ${new Date().toLocaleDateString()}*
