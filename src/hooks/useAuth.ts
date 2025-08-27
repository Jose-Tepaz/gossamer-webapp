'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthState } from '@/types/auth';

export const useAuth = () => {
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

        // Create user in Airtable (Demo mode)
        try {
          const { createUser } = await import('@/lib/airtable');
          const airtableUserId = await createUser({
            memberstack_id: 'demo-user-id',
            email: email,
            first_name: firstName || 'Demo',
            last_name: lastName || 'User',
            plan_type: 'Free',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_broker_connected: false,
          });
          
          if (airtableUserId) {
            console.log('✅ User created in Airtable:', airtableUserId);
          }
        } catch (airtableError) {
          console.error('❌ Error creating user in Airtable:', airtableError);
          // Continue with registration even if Airtable fails
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

          // Create user in Airtable (Real mode)
          try {
            const { createUser } = await import('@/lib/airtable');
            const airtableUserId = await createUser({
              memberstack_id: memberData.id,
              email: memberData.auth?.email || email,
              first_name: firstName || '',
              last_name: lastName || '',
              plan_type: 'Free',
              created_at: memberData.createdAt,
              updated_at: memberData.lastLogin || memberData.createdAt,
              is_broker_connected: false,
            });
            
            if (airtableUserId) {
              console.log('✅ User created in Airtable:', airtableUserId);
            }
          } catch (airtableError) {
            console.error('❌ Error creating user in Airtable:', airtableError);
            // Continue with registration even if Airtable fails
          }

          setAuthState({ user, loading: false, error: null });
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

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
      
      if (!publicKey) {
        console.log('🚨 Demo mode - password reset not available');
        return { success: false, error: 'Password reset not available in demo mode' };
      }

      try {
        const MemberStack = await import('@memberstack/dom');
        const memberstack = MemberStack.default.init({ publicKey });
        
        const result = await memberstack.sendMemberResetPasswordEmail({ email }) as any;
        
        if (result) {
          return { success: true, error: null };
        } else {
          return { success: false, error: 'Failed to send reset email' };
        }
      } catch (memberstackError) {
        console.error('Memberstack reset password error:', memberstackError);
        return { success: false, error: 'Failed to send reset email' };
      }
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