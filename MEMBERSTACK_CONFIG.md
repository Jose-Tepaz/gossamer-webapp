# 🚀 Configuración de Memberstack - Guía Completa

## 📋 Estado Actual
- ✅ **Aplicación funcional en modo DEMO**
- ✅ **Código de Memberstack integrado y listo**
- ✅ **Memberstack REAL configurado y funcionando**
- ✅ **Login/Logout con usuarios reales**
- ✅ **Integración híbrida (demo + real)**

## 🔧 Configuración Exitosa Implementada

### 1. Crear cuenta en Memberstack
1. Ve a [Memberstack.com](https://memberstack.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto/aplicación

### 2. Obtener API Keys
1. En tu dashboard de Memberstack, ve a **Settings** > **API Keys**
2. Copia tu **Public Key** (empieza con `pk_sb_`)
3. Copia tu **Secret Key** (empieza con `sk_`)

### 3. Configurar Variables de Entorno
1. En la raíz de tu proyecto `financial-app`, crea un archivo `.env.local`
2. Agrega tus keys:

```bash
# .env.local
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=pk_sb_tu_public_key_aqui
MEMBERSTACK_SECRET_KEY=sk_tu_secret_key_aqui
```

**Ejemplo real funcionando:**
```bash
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=pk_sb_b121...
MEMBERSTACK_SECRET_KEY=sk_tu_secret_key_aqui
```

### 4. Configurar Memberstack Dashboard

#### A. Configurar Dominio Permitido
1. Ve a **Settings** > **Domains**
2. Agrega `localhost:3000` (para desarrollo)
3. Agrega tu dominio de producción cuando despliegues

#### B. Configurar Campos Personalizados ⚠️ **IMPORTANTE**
1. Ve a **Settings** > **Custom Fields**
2. Agrega estos campos **EXACTAMENTE** con estos nombres:
   - `first-name` (tipo: Text) ← **Usar guiones, no camelCase**
   - `last-name` (tipo: Text) ← **Usar guiones, no camelCase**

**🚨 Nota Crítica**: Memberstack usa nombres con guiones (`first-name`, `last-name`), no camelCase (`firstName`, `lastName`).

#### C. Crear Planes de Suscripción (Opcional)
1. Ve a **Plans** en tu dashboard
2. Crea estos planes:
   - **Free**: Plan gratuito
   - **Pro**: Plan profesional  
   - **Premium**: Plan premium

### 5. Reiniciar la Aplicación
1. Guarda el archivo `.env.local`
2. Reinicia tu servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🎯 Cómo Funciona la Integración

### Sistema Híbrido Inteligente

#### **Detección Automática**
```javascript
const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;

if (!publicKey) {
  // Modo Demo - localStorage
  console.log('🚨 Memberstack not configured - running in DEMO mode');
} else {
  // Modo Real - Memberstack
  console.log('✅ Memberstack configured - attempting real auth');
}
```

#### **Modo Demo (Sin API Keys)**
- Login funciona con cualquier email + contraseña 6+ caracteres
- Datos se guardan en localStorage
- Usuario demo: "Demo User" con plan "Pro"
- Mensaje en consola: "🚨 Memberstack not configured - running in DEMO mode"

#### **Modo Real (Con API Keys)**
- Login real con usuarios de Memberstack
- Registro crea usuarios reales
- Datos sincronizados con Memberstack
- Información real del usuario (nombre, plan, etc.)
- Logout real que limpia la sesión de Memberstack

### Estructura de Datos de Memberstack

#### **Respuesta de Login Exitoso:**
```javascript
{
  data: {
    member: {
      id: "mem_sb_...",
      auth: {
        email: "usuario@ejemplo.com",
        hasPassword: true
      },
      customFields: {
        "first-name": "José",
        "last-name": "Tepaz Par"
      },
      planConnections: [{
        planId: "pro" // o "premium", "free"
      }],
      createdAt: "2025-02-07T21:44:53.743Z",
      lastLogin: "2025-07-08T05:16:27.751Z",
      permissions: ["dashboard"],
      verified: false
    }
  },
  tokens: {
    accessToken: "eyJhbGciOiJSUzI1NiIs...",
    expires: 1753161583548,
    type: "bearer"
  }
}
```

#### **Mapeo a Nuestro Sistema:**
```javascript
const user: User = {
  id: memberData.id,
  email: memberData.auth?.email,
  firstName: memberData.customFields?.['first-name'] || '',
  lastName: memberData.customFields?.['last-name'] || '',
  planType: memberData.planConnections?.[0]?.planId === 'pro' ? 'Pro' : 
           memberData.planConnections?.[0]?.planId === 'premium' ? 'Premium' : 'Free',
  createdAt: memberData.createdAt,
  updatedAt: memberData.lastLogin || memberData.createdAt,
};
```

## 🧪 Pruebas y Verificación

### **Logs de Diagnóstico**
La aplicación incluye logging detallado:

```javascript
🔍 Checking Memberstack configuration...
Public Key exists: true
Public Key preview: pk_sb_b121...
✅ Memberstack configured - attempting real auth
✅ Found existing member: usuario@ejemplo.com
🔍 Login attempt for: usuario@ejemplo.com
🔄 Attempting Memberstack login...
📋 Memberstack login result: [objeto con datos del usuario]
```

### **Verificar Funcionamiento**
1. **Modo Demo**: Mensajes con 🚨
2. **Modo Real**: Mensajes con ✅
3. **Errores**: Mensajes con ❌

### **Casos de Prueba**
#### Sin API Keys (Modo Demo)
1. Ve a `/login`
2. Usa: `test@example.com` + `123456`
3. Debe funcionar y mostrar "Demo User"

#### Con API Keys (Modo Real)
1. Ve a `/register` para crear cuenta
2. Ve a `/login` con credenciales reales
3. Debe mostrar datos reales del usuario

## 🔧 Implementación Técnica

### **Funciones Principales**

#### **1. Inicialización**
```javascript
// Verifica configuración al cargar la app
useEffect(() => {
  const initAuth = async () => {
    const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
    
    if (!publicKey) {
      // Modo demo
      checkLocalStorage();
    } else {
      // Modo real - verificar sesión existente
      const member = await memberstack.getCurrentMember();
      if (member?.data) {
        setUser(mapMemberToUser(member.data.member));
      }
    }
  };
});
```

#### **2. Login Real**
```javascript
const result = await memberstack.loginMemberEmailPassword({
  email,
  password,
});

if (result && result.data && result.data.member) {
  const user = mapMemberToUser(result.data.member);
  setAuthState({ user, loading: false, error: null });
  router.push('/dashboard');
}
```

#### **3. Registro Real**
```javascript
const result = await memberstack.signupMemberEmailPassword({
  email,
  password,
  customFields: {
    'first-name': firstName || '',
    'last-name': lastName || '',
  },
});
```

#### **4. Logout Real**
```javascript
const logout = async () => {
  if (publicKey) {
    await memberstack.logout(); // Logout real
  } else {
    localStorage.removeItem('user'); // Logout demo
  }
  router.push('/login');
};
```

### **Manejo de Errores**
- **Fallback automático**: Si Memberstack falla, usa modo demo
- **Logging detallado**: Para debugging fácil
- **Validación de datos**: Verifica estructura de respuestas

## 🔍 Debugging y Solución de Problemas

### **Mensajes Comunes en Consola**
- `🔍 Checking Memberstack configuration...` → Verificando configuración
- `✅ Memberstack configured` → API keys encontradas
- `✅ Found existing member` → Usuario ya logueado
- `🔄 Attempting Memberstack login...` → Intentando login
- `📋 Memberstack login result` → Respuesta de Memberstack
- `❌ Memberstack error` → Error, fallback a demo

### **Errores Comunes y Soluciones**

#### **"Invalid email or password"**
- **Causa**: Credenciales incorrectas o usuario no existe
- **Solución**: Verificar credenciales o registrar usuario primero

#### **"Public Key exists: false"**
- **Causa**: API key no configurada
- **Solución**: Verificar archivo `.env.local`

#### **"Domain not allowed"**
- **Causa**: Dominio no permitido en Memberstack
- **Solución**: Agregar `localhost:3000` en configuración

#### **Campos personalizados no aparecen**
- **Causa**: Nombres incorrectos (`firstName` vs `first-name`)
- **Solución**: Usar nombres con guiones en Memberstack

## 📁 Archivos Modificados

### **`src/hooks/useAuth.ts`**
- ✅ Detección automática de configuración
- ✅ Modo híbrido (demo + real)
- ✅ Manejo correcto de respuestas de Memberstack
- ✅ Logging detallado para debugging
- ✅ Manejo de errores con fallback
- ✅ Mapeo correcto de campos personalizados

### **Componentes Integrados:**
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/DashboardLayout.tsx`

## 🚀 Funcionalidades Completadas

### ✅ **Autenticación Completa**
- **Login Real**: Con usuarios de Memberstack
- **Registro Real**: Crea usuarios en Memberstack
- **Logout Real**: Limpia sesión de Memberstack
- **Sesión Persistente**: Mantiene login entre recargas
- **Protección de Rutas**: Dashboard protegido

### ✅ **Integración de Datos**
- **Información Real**: Nombre, email, plan del usuario
- **Campos Personalizados**: first-name, last-name
- **Planes de Suscripción**: Free, Pro, Premium
- **Permisos**: Basados en configuración de Memberstack

### ✅ **Interfaz de Usuario**
- **Sidebar**: Muestra datos reales del usuario
- **Dashboard**: Información personalizada
- **Estados de Carga**: Spinners durante autenticación
- **Manejo de Errores**: Mensajes claros al usuario

## 🎯 Próximos Pasos Sugeridos

1. **Configurar Webhooks**: Para sincronizar con Airtable
2. **Personalizar Emails**: Templates de bienvenida
3. **Configurar Pagos**: Integración con Stripe
4. **Agregar Validaciones**: Campos adicionales
5. **Implementar Reset Password**: Página de recuperación

## 🆘 Soporte Técnico

### **Para Debugging:**
1. Abrir F12 → Console
2. Buscar mensajes con emojis (🔍, ✅, ❌, 🚨)
3. Verificar estructura de respuestas de Memberstack
4. Comprobar configuración de campos personalizados

### **Recursos Útiles:**
- [Documentación de Memberstack](https://docs.memberstack.com)
- [API Reference](https://docs.memberstack.com/hc/en-us/articles/4406274140813-Frontend-API-Reference)
- [Custom Fields Guide](https://docs.memberstack.com/hc/en-us/articles/4406274140813)

---

## 🎉 **¡Integración Exitosa!**

**Tu aplicación ahora funciona con Memberstack real:**
- ✅ Login con usuarios reales
- ✅ Datos sincronizados
- ✅ Interfaz personalizada
- ✅ Modo híbrido funcional
- ✅ Sistema robusto con fallbacks

**Usuario de prueba funcionando**: `josetepaz28@gmail.com`
**Nombre mostrado**: "José Tepaz Par"
**Plan**: Según configuración en Memberstack 