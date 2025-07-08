# Integración de Memberstack - Guía Completa

## 🚨 Estado Actual

**La aplicación funciona en modo DEMO sin Memberstack.**

- ✅ Login/Registro funcional con datos mock
- ✅ Persistencia con localStorage
- ✅ Protección de rutas
- ✅ UI completa y funcional
- ⚠️ Memberstack deshabilitado temporalmente

## 🔧 Para Activar Memberstack

### 1. Obtener API Keys
1. Crear cuenta en [Memberstack](https://memberstack.com)
2. Crear nuevo proyecto
3. Obtener las keys del dashboard

### 2. Configurar Variables de Entorno
```bash
# Crear archivo .env.local
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=pk_sb_tu_key_aqui
MEMBERSTACK_SECRET_KEY=sk_tu_key_aqui
```

### 3. Reemplazar el Hook useAuth

Reemplaza el contenido de `src/hooks/useAuth.ts` con:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  planType?: 'Free' | 'Pro' | 'Premium';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  // Initialize Memberstack
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const MemberStack = await import('@memberstack/dom');
        const memberstack = MemberStack.default.init({
          publicKey: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY || '',
        });

        // Check if user is already logged in
        const member = await memberstack.getCurrentMember();
        
        if (member) {
          const user: User = {
            id: member.id,
            email: member.email,
            firstName: member.customFields?.firstName || '',
            lastName: member.customFields?.lastName || '',
            planType: member.planConnections?.[0]?.planId === 'pro' ? 'Pro' : 
                     member.planConnections?.[0]?.planId === 'premium' ? 'Premium' : 'Free',
            createdAt: member.createdAt,
            updatedAt: member.updatedAt,
          };
          
          setAuthState({ user, loading: false, error: null });
        } else {
          setAuthState({ user: null, loading: false, error: null });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({ 
          user: null, 
          loading: false, 
          error: 'Error initializing authentication' 
        });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const MemberStack = await import('@memberstack/dom');
      const memberstack = MemberStack.default.init({
        publicKey: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY || '',
      });

      const result = await memberstack.signIn({
        email,
        password,
      });

      if (result.success && result.data) {
        const member = result.data;
        const user: User = {
          id: member.id,
          email: member.email,
          firstName: member.customFields?.firstName || '',
          lastName: member.customFields?.lastName || '',
          planType: member.planConnections?.[0]?.planId === 'pro' ? 'Pro' : 
                   member.planConnections?.[0]?.planId === 'premium' ? 'Premium' : 'Free',
          createdAt: member.createdAt,
          updatedAt: member.updatedAt,
        };

        setAuthState({ user, loading: false, error: null });
        router.push('/dashboard');
        return { success: true, user };
      } else {
        const errorMessage = result.error || 'Login failed';
        setAuthState({ 
          user: null, 
          loading: false, 
          error: errorMessage 
        });
        return { success: false, error: errorMessage };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      setAuthState({ 
        user: null, 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const MemberStack = await import('@memberstack/dom');
      const memberstack = MemberStack.default.init({
        publicKey: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY || '',
      });

      const result = await memberstack.signUp({
        email,
        password,
        customFields: {
          firstName: firstName || '',
          lastName: lastName || '',
        },
      });

      if (result.success && result.data) {
        const member = result.data;
        const user: User = {
          id: member.id,
          email: member.email,
          firstName: firstName || '',
          lastName: lastName || '',
          planType: 'Free',
          createdAt: member.createdAt,
          updatedAt: member.updatedAt,
        };

        setAuthState({ user, loading: false, error: null });
        router.push('/dashboard');
        return { success: true, user };
      } else {
        const errorMessage = result.error || 'Registration failed';
        setAuthState({ 
          user: null, 
          loading: false, 
          error: errorMessage 
        });
        return { success: false, error: errorMessage };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      setAuthState({ 
        user: null, 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const MemberStack = await import('@memberstack/dom');
      const memberstack = MemberStack.default.init({
        publicKey: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY || '',
      });
      
      await memberstack.signOut();
      setAuthState({ user: null, loading: false, error: null });
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const MemberStack = await import('@memberstack/dom');
      const memberstack = MemberStack.default.init({
        publicKey: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY || '',
      });
      
      const result = await memberstack.sendResetPasswordEmail({ email });
      return { success: result.success, error: result.error };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to send reset email' };
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    resetPassword,
  };
};
```

## 🧪 Modo Demo Actual

### Funcionalidades
- **Login**: Cualquier email/password funciona
- **Registro**: Crea usuario demo automáticamente
- **Persistencia**: Usa localStorage
- **Usuario demo**: Nombre "Demo User", plan "Pro"
- **Logout**: Limpia localStorage y redirige

### Credenciales de prueba
- **Email**: cualquier email válido
- **Password**: cualquier password (mínimo 6 caracteres)

## 🔄 Migración a Memberstack

1. **Configurar variables de entorno**
2. **Reemplazar useAuth.ts** con el código de arriba
3. **Reiniciar servidor**: `npm run dev`
4. **Probar login/registro** con cuentas reales

## 📝 Notas Importantes

- La aplicación funciona completamente sin Memberstack
- Todos los componentes están listos para la integración
- Solo necesitas cambiar el hook useAuth cuando tengas las API keys
- Los datos se persisten en localStorage en modo demo
- La UI es idéntica en ambos modos 