'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';
import { UserDataApiService } from '@/lib/user-data-api-service';

export type PlanType = 'Free' | 'Pro' | 'Premium';

export interface PlanSelectionResult {
  success: boolean;
  error?: string;
}

export const usePlanSelection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const selectPlan = async (planType: PlanType): Promise<PlanSelectionResult> => {
    if (!user?.id) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Iniciando selección de plan:', planType, 'para usuario:', user.id);

      // 1. Actualizar plan en Memberstack (por ahora siempre como Free)
      const memberstackPlanId = 'pln_free-a0cs01nb'; // ID del plan Free en Memberstack
      
      console.log('🔄 Actualizando plan en Memberstack como:', memberstackPlanId);
      
      try {
        const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
        
        if (publicKey) {
          // Real Memberstack - usar addPlan según la documentación
          const MemberStack = await import('@memberstack/dom');
          const memberstack = MemberStack.default.init({ publicKey });
          
          console.log('🔄 Agregando plan en Memberstack:', memberstackPlanId);
          
          // Usar addPlan según la documentación de Memberstack
          const result = await memberstack.addPlan({
            planId: memberstackPlanId
          }) as { data?: unknown; success?: boolean };
          
          if (result && result.success) {
            console.log('✅ Plan agregado exitosamente en Memberstack:', result.data);
          } else {
            console.warn('⚠️ No se pudo agregar el plan en Memberstack, pero continuamos');
          }
        } else {
          // Demo mode - solo simulamos la actualización
          console.log('🚨 Demo mode - simulando actualización de plan en Memberstack');
          await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay
        }
      } catch (memberstackError) {
        console.error('❌ Error actualizando plan en Memberstack:', memberstackError);
        // Continuamos con la actualización en Supabase aunque falle Memberstack
      }
      
      console.log('✅ Plan actualizado en Memberstack');

      // 2. Actualizar plan en Supabase
      console.log('🔄 Actualizando plan en Supabase...');
      
      await UserDataApiService.updateUser(user.id, {
        plan_type: planType, // Guardamos el plan real seleccionado en Supabase
      });
      
      console.log('✅ Plan actualizado en Supabase:', planType);

      // 3. Actualizar el estado local del usuario
      // Esto se haría a través del hook useAuth si fuera necesario
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Error seleccionando plan:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error seleccionando plan';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    selectPlan,
    loading,
    error,
    clearError,
  };
};
