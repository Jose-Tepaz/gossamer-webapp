/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useUserData } from './useUserData';
import { snapTradeService, AccountHoldingsResponse } from '@/lib/snaptrade-service';

export function useAccountHoldings(accountId: string | null) {
  const { user } = useAuth();
  const { userData } = useUserData();
  const [holdings, setHoldings] = useState<AccountHoldingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Función para cargar holdings de la cuenta
  const loadHoldings = useCallback(async () => {
    if (!accountId || !user?.id || !userData?.user_secret) {
      console.log('🔄 No hay accountId, usuario o userSecret, saltando carga de holdings');
      setHoldings(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Cargando holdings de la cuenta:', accountId);
      const holdingsData = await snapTradeService.listAccountHoldings(
        accountId,
        user.id,
        userData.user_secret
      );

      console.log('✅ Holdings cargados:', holdingsData);
      console.log('🔍 Estructura de la respuesta:', {
        hasDirectData: !!(holdingsData.account || holdingsData.positions),
        hasHoldingsProperty: !!((holdingsData as any).holdings),
        keys: Object.keys(holdingsData)
      });
      
      // La API devuelve { holdings: {...} }, necesitamos extraer la propiedad holdings
      const actualHoldings = (holdingsData as any).holdings || holdingsData;
      setHoldings(actualHoldings || null);

    } catch (err: unknown) {
      console.error('❌ Error cargando holdings:', err);
      const errorMessage = (err as any).message || 'Error cargando holdings';
      setError(errorMessage);
      
      // Si es un error 404, significa que la cuenta no existe o no está conectada
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        console.log('ℹ️ Cuenta no encontrada o no conectada, estableciendo holdings como null');
        setHoldings(null);
      }
    } finally {
      setLoading(false);
    }
  }, [accountId, user?.id, userData?.user_secret]);

  // Función para refrescar los holdings
  const refreshHoldings = useCallback(() => {
    loadHoldings();
  }, [loadHoldings]);

  // Manejar hidratación
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Cargar holdings cuando cambien los parámetros (solo después de hidratación)
  useEffect(() => {
    if (isHydrated && accountId) {
      loadHoldings();
    }
  }, [loadHoldings, isHydrated, accountId]);

  return {
    holdings,
    loading,
    error,
    isHydrated,
    refreshHoldings,
    loadHoldings
  };
}
