'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthState, AuthContextType } from '@/types/auth';
import { syncUserWithSupabase, registerUserInSnapTrade } from '@/lib/memberstack-supabase-sync';

export const useAuth = (): AuthContextType => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  // Initialize auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
        
        console.log('🔍 Checking Memberstack configuration...');
        console.log('Public Key exists:', !!publicKey);
        console.log('Public Key preview:', publicKey ? publicKey.substring(0, 10) + '...' : 'NOT FOUND');
        
        if (!publicKey) {
          console.log('🚨 Memberstack not configured - running in DEMO mode');
          // Demo mode - check localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            setAuthState({ user, loading: false, error: null });
          } else {
            setAuthState({ user: null, loading: false, error: null });
          }
          return;
        }

        console.log('✅ Memberstack configured - attempting real auth');
        
        // Real Memberstack - check current member
        try {
          const MemberStack = await import('@memberstack/dom');
          const memberstack = MemberStack.default.init({ publicKey });
          
          const member = await memberstack.getCurrentMember();
          
          if (member?.data) {
            const memberData = member.data as any;
            console.log('✅ Found existing member:', memberData.auth?.email);
            const user: User = {
              id: memberData.id,
              email: memberData.auth?.email || memberData.email,
              firstName: memberData.customFields?.['first-name'] || '',
              lastName: memberData.customFields?.['last-name'] || '',
              planType: memberData.planConnections?.[0]?.planId === 'pro' ? 'Pro' : 
                       memberData.planConnections?.[0]?.planId === 'premium' ? 'Premium' : 'Free',
              createdAt: memberData.createdAt,
              updatedAt: memberData.lastLogin || memberData.createdAt,
            };
            
            setAuthState({ user, loading: false, error: null });
            
            // Sincronizar con Supabase de manera no bloqueante
            syncUserWithSupabase(user).catch(error => {
              console.error('Error en sincronización con Supabase:', error);
            });
          } else {
            console.log('ℹ️ No existing member found');
            setAuthState({ user: null, loading: false, error: null });
          }
        } catch (memberstackError) {
          console.error('❌ Memberstack error, falling back to demo mode:', memberstackError);
          // Fallback to demo mode
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            setAuthState({ user, loading: false, error: null });
          } else {
            setAuthState({ user: null, loading: false, error: null });
          }
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
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
      const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
      
      console.log('🔍 Login attempt for:', email);
      console.log('Public Key exists:', !!publicKey);
      
      if (!publicKey) {
        // Demo mode
        console.log('🚨 Using DEMO mode - configure Memberstack keys for real auth');
        
        if (!email || !password || password.length < 6) {
          const errorMessage = 'Invalid email or password (min 6 characters)';
          setAuthState({ user: null, loading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
        
        const user: User = {
          id: 'demo-user-id',
          email: email,
          firstName: 'Demo',
          lastName: 'User',
          planType: 'Pro',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({ user, loading: false, error: null });
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
        
        return { success: true, user };
      }

      // Real Memberstack login
      console.log('🔄 Attempting Memberstack login...');
      try {
        const MemberStack = await import('@memberstack/dom');
        const memberstack = MemberStack.default.init({ publicKey });

        const result = await memberstack.loginMemberEmailPassword({
          email,
          password,
        }) as any;
        
        console.log('📋 Memberstack login result:', result);

        if (result && result.data && result.data.member) {
          const memberData = result.data.member;
          const user: User = {
            id: memberData.id,
            email: memberData.auth?.email || email,
            firstName: memberData.customFields?.['first-name'] || '',
            lastName: memberData.customFields?.['last-name'] || '',
            planType: memberData.planConnections?.[0]?.planId === 'pro' ? 'Pro' : 
                     memberData.planConnections?.[0]?.planId === 'premium' ? 'Premium' : 'Free',
            createdAt: memberData.createdAt,
            updatedAt: memberData.lastLogin || memberData.createdAt,
          };

          setAuthState({ user, loading: false, error: null });
          
          // Sincronizar con Supabase de manera no bloqueante
          syncUserWithSupabase(user).catch(error => {
            console.error('Error en sincronización con Supabase:', error);
          });
          
          router.push('/dashboard');
          return { success: true, user };
        } else {
          const errorMessage = 'Invalid email or password';
          setAuthState({ 
            user: null, 
            loading: false, 
            error: errorMessage 
          });
          return { success: false, error: errorMessage };
        }
      } catch (memberstackError) {
        console.error('Memberstack login error:', memberstackError);
        const errorMessage = 'Login failed. Please check your credentials.';
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
      const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
      
      if (!publicKey) {
        // Demo mode
        console.log('🚨 Using DEMO mode - configure Memberstack keys for real auth');
        
        const user: User = {
          id: 'demo-user-id',
          email: email,
          firstName: firstName || 'Demo',
          lastName: lastName || 'User',
          planType: 'Free',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Create user in Supabase (Demo mode)
        try {
          await syncUserWithSupabase(user);
          console.log('✅ User synced with Supabase');
        } catch (supabaseError) {
          console.error('❌ Error syncing user with Supabase:', supabaseError);
          // Continue with registration even if Supabase fails
        }

        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({ user, loading: false, error: null });
        
        setTimeout(() => {
          router.push('/onboarding');
        }, 100);
        
        return { success: true, user };
      }

      // Real Memberstack registration
      try {
        const MemberStack = await import('@memberstack/dom');
        const memberstack = MemberStack.default.init({ publicKey });

        const result = await memberstack.signupMemberEmailPassword({
          email,
          password,
          customFields: {
            'first-name': firstName || '',
            'last-name': lastName || '',
          },
        }) as any;

        if (result && result.data && result.data.member) {
          const memberData = result.data.member;
          const user: User = {
            id: memberData.id,
            email: memberData.auth?.email || email,
            firstName: firstName || '',
            lastName: lastName || '',
            planType: 'Free',
            createdAt: memberData.createdAt,
            updatedAt: memberData.lastLogin || memberData.createdAt,
          };

          // Create user in Supabase (Real mode)
          try {
            await syncUserWithSupabase(user);
            console.log('✅ User synced with Supabase');
          } catch (supabaseError) {
            console.error('❌ Error syncing user with Supabase:', supabaseError);
            // Continue with registration even if Supabase fails
          }

          setAuthState({ user, loading: false, error: null });
          
          // Registrar automáticamente en SnapTrade después del registro exitoso
          registerUserInSnapTrade(user).catch(error => {
            console.error('Error en registro automático de SnapTrade:', error);
          });
          
          router.push('/onboarding');
          return { success: true, user };
        } else {
          const errorMessage = 'Registration failed';
          setAuthState({ 
            user: null, 
            loading: false, 
            error: errorMessage 
          });
          return { success: false, error: errorMessage };
        }
      } catch (memberstackError) {
        console.error('Memberstack registration error:', memberstackError);
        const errorMessage = 'Registration failed. Please try again.';
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
      const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
      
      if (!publicKey) {
        // Demo mode
        localStorage.removeItem('user');
        setAuthState({ user: null, loading: false, error: null });
        router.push('/login');
        return;
      }

      // Real Memberstack logout
      try {
        const MemberStack = await import('@memberstack/dom');
        const memberstack = MemberStack.default.init({ publicKey });
        
        await memberstack.logout();
        
        // Nota: No eliminamos el usuario de Supabase en logout
        // Solo se elimina cuando se elimina la cuenta en Memberstack
        
        setAuthState({ user: null, loading: false, error: null });
        router.push('/login');
      } catch (memberstackError) {
        console.error('Memberstack logout error:', memberstackError);
        // Fallback to local logout
        localStorage.removeItem('user');
        setAuthState({ user: null, loading: false, error: null });
        router.push('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback to local logout
      localStorage.removeItem('user');
      setAuthState({ user: null, loading: false, error: null });
      router.push('/login');
    }
  };

  // Session management - check for expired sessions
  useEffect(() => {
    const checkSessionValidity = async () => {
      if (!authState.user) return;

      try {
        const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
        
        if (!publicKey) {
          // Demo mode - no session expiration
          return;
        }

        // Check session validity every 5 minutes
        const MemberStack = await import('@memberstack/dom');
        const memberstack = MemberStack.default.init({ publicKey });
        
        const member = await memberstack.getCurrentMember();
        
        if (!member?.data) {
          console.log('🔄 Session expired, logging out...');
          await logout();
        }
      } catch (error) {
        console.error('❌ Error checking session validity:', error);
        // If we can't check the session, assume it's expired for security
        await logout();
      }
    };

    // Check session validity every 5 minutes
    const interval = setInterval(checkSessionValidity, 5 * 60 * 1000);

    // Also check on window focus (user comes back to tab)
    const handleFocus = () => {
      checkSessionValidity();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [authState.user, logout]);

  // Forgot password function (send reset email)
  const forgotPassword = async (email: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
      
      if (!publicKey) {
        console.log('🚨 Demo mode - password reset not available');
        setAuthState(prev => ({ ...prev, loading: false, error: 'Password reset not available in demo mode' }));
        return { success: false, error: 'Password reset not available in demo mode' };
      }

      try {
        const MemberStack = await import('@memberstack/dom');
        const memberstack = MemberStack.default.init({ publicKey });
        
        const result = await memberstack.sendMemberResetPasswordEmail({ email }) as any;
        
        if (result) {
          setAuthState(prev => ({ ...prev, loading: false, error: null }));
          return { success: true };
        } else {
          const errorMessage = 'Failed to send reset email';
          setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
          return { success: false, error: errorMessage };
        }
      } catch (memberstackError) {
        console.error('Memberstack forgot password error:', memberstackError);
        const errorMessage = 'Failed to send reset email. Please check your email address.';
        setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
        return { success: false, error: errorMessage };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  // Reset password function (with code and new password)
  const resetPassword = async (code: string, newPassword: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
      
      if (!publicKey) {
        console.log('🚨 Demo mode - password reset not available');
        setAuthState(prev => ({ ...prev, loading: false, error: 'Password reset not available in demo mode' }));
        return { success: false, error: 'Password reset not available in demo mode' };
      }

      try {
        const MemberStack = await import('@memberstack/dom');
        const memberstack = MemberStack.default.init({ publicKey });
        
        // Memberstack maneja el reset de contraseña con el código
        // que el usuario recibe por email (pasamos el código como token)
        const result = await memberstack.resetMemberPassword({
          token: code,
          newPassword
        }) as any;
        
        if (result) {
          setAuthState(prev => ({ ...prev, loading: false, error: null }));
          return { success: true };
        } else {
          const errorMessage = 'Failed to reset password';
          setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
          return { success: false, error: errorMessage };
        }
      } catch (memberstackError) {
        console.error('Memberstack reset password error:', memberstackError);
        const errorMessage = 'Failed to reset password. The code may be invalid or expired.';
        setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
        return { success: false, error: errorMessage };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  // Send email verification function
  const sendEmailVerification = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
      
      if (!publicKey) {
        console.log('🚨 Demo mode - email verification not available');
        setAuthState(prev => ({ ...prev, loading: false, error: 'Email verification not available in demo mode' }));
        return { success: false, error: 'Email verification not available in demo mode' };
      }

      try {
        const MemberStack = await import('@memberstack/dom');
        const memberstack = MemberStack.default.init({ publicKey });
        
        const result = await memberstack.sendMemberVerificationEmail() as any;
        
        if (result) {
          setAuthState(prev => ({ ...prev, loading: false, error: null }));
          return { success: true };
        } else {
          const errorMessage = 'Failed to send verification email';
          setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
          return { success: false, error: errorMessage };
        }
      } catch (memberstackError) {
        console.error('Memberstack email verification error:', memberstackError);
        const errorMessage = 'Failed to send verification email. Please try again.';
        setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
        return { success: false, error: errorMessage };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification email';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    sendEmailVerification,
  };
}; 