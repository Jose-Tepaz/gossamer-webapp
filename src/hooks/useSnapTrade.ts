'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { snapTradeService, SnapTradeUser, ConnectPortalUrlRequest, BrokerageAccount, AccountHoldingsResponse } from '@/lib/snaptrade-service';
import { useAuth } from './useAuth';
import { UserDataApiService } from '@/lib/user-data-api-service';

export interface UseSnapTradeReturn {
  // Estados
  loading: boolean;
  error: string | null;
  
  // Datos
  snapTradeUser: SnapTradeUser | null;
  accounts: BrokerageAccount[];
  selectedAccountHoldings: AccountHoldingsResponse | null;
  
  // Funciones
  registerUser: () => Promise<void>;
  getConnectPortalUrl: (options?: Partial<ConnectPortalUrlRequest>) => Promise<string>;
  loadAccounts: () => Promise<void>;
  loadAccountHoldings: (accountId: string) => Promise<void>;
  clearError: () => void;
}

export function useSnapTrade(): UseSnapTradeReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapTradeUser, setSnapTradeUser] = useState<SnapTradeUser | null>(null);
  const [accounts, setAccounts] = useState<BrokerageAccount[]>([]);
  const [selectedAccountHoldings, setSelectedAccountHoldings] = useState<AccountHoldingsResponse | null>(null);
  
  const { user } = useAuth();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Registra el usuario actual en SnapTrade
   */
  const registerUser = useCallback(async () => {
    if (!user?.id) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Registrar usuario en SnapTrade
      console.log('🔄 Registrando usuario en SnapTrade con ID:', user.id);
      const snapTradeUserData = await snapTradeService.registerUser(user.id);
      
      // 2. Guardar userSecret en Supabase
      console.log('🔄 Guardando userSecret en Supabase...');
      await UserDataApiService.updateUser(user.id, {
        user_secret: snapTradeUserData.userSecret,
      });
      
      setSnapTradeUser(snapTradeUserData);
      console.log('✅ Usuario registrado y userSecret guardado');
      
    } catch (err: unknown) {
      console.error('❌ Error en registerUser:', err);
      setError((err as any).message || 'Error registrando usuario en SnapTrade');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Obtiene la URL del portal de conexión
   */
  const getConnectPortalUrl = useCallback(async (options: Partial<ConnectPortalUrlRequest> = {}): Promise<string> => {
    if (!user?.id) {
      throw new Error('Usuario no autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Obtener datos del usuario desde Supabase
      console.log('🔄 Obteniendo datos del usuario desde Supabase...');
      const userData = await UserDataApiService.getUserByMemberstackId(user.id);
      
      if (!userData?.user_secret) {
        throw new Error('Usuario no tiene userSecret. Debe registrarse primero en SnapTrade.');
      }

      // 2. Obtener URL del portal
      const request: ConnectPortalUrlRequest = {
        userId: user.id,
        userSecret: userData.user_secret,
        ...options,
      };

      console.log('🔄 Obteniendo URL del portal de conexión...');
      const response = await snapTradeService.getConnectPortalUrl(request);
      
      console.log('✅ URL del portal obtenida:', response.redirectURI);
      console.log('🔍 Tipo de redirectURI:', typeof response.redirectURI);
      console.log('🔍 redirectURI es válida:', response.redirectURI && typeof response.redirectURI === 'string' && response.redirectURI.startsWith('http'));
      
      // Validar que la URL sea válida
      if (!response.redirectURI || typeof response.redirectURI !== 'string' || !response.redirectURI.startsWith('http')) {
        throw new Error(`URL del portal inválida: ${response.redirectURI}`);
      }
      
      return response.redirectURI;
      
    } catch (err: unknown) {
      console.error('❌ Error en getConnectPortalUrl:', err);
      setError((err as any).message || 'Error obteniendo URL del portal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Carga las cuentas del usuario
   */
  const loadAccounts = useCallback(async () => {
    if (!user?.id) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Obtener datos del usuario desde Supabase
      console.log('🔄 Obteniendo datos del usuario desde Supabase...');
      const userData = await UserDataApiService.getUserByMemberstackId(user.id);
      
      if (!userData?.user_secret) {
        throw new Error('Usuario no tiene userSecret. Debe registrarse primero en SnapTrade.');
      }

      // 2. Listar cuentas
      console.log('🔄 Cargando cuentas del usuario...');
      const accountsData = await snapTradeService.listAccounts(user.id, userData.user_secret);
      
      setAccounts(accountsData);
      console.log('✅ Cuentas cargadas:', accountsData.length);
      
    } catch (err: unknown) {
      console.error('❌ Error en loadAccounts:', err);
      setError((err as any).message || 'Error cargando cuentas');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Carga los holdings de una cuenta específica
   */
  const loadAccountHoldings = useCallback(async (accountId: string) => {
    if (!user?.id) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Obtener datos del usuario desde Supabase
      console.log('🔄 Obteniendo datos del usuario desde Supabase...');
      const userData = await UserDataApiService.getUserByMemberstackId(user.id);
      
      if (!userData?.user_secret) {
        throw new Error('Usuario no tiene userSecret. Debe registrarse primero en SnapTrade.');
      }

      // 2. Listar holdings
      console.log('🔄 Cargando holdings de la cuenta:', accountId);
      const holdingsData = await snapTradeService.listAccountHoldings(accountId, user.id, userData.user_secret);
      
      setSelectedAccountHoldings(holdingsData);
      console.log('✅ Holdings cargados para cuenta:', accountId);
      
    } catch (err: unknown) {
      console.error('❌ Error en loadAccountHoldings:', err);
      setError((err as any).message || 'Error cargando holdings');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  return {
    // Estados
    loading,
    error,
    
    // Datos
    snapTradeUser,
    accounts,
    selectedAccountHoldings,
    
    // Funciones
    registerUser,
    getConnectPortalUrl,
    loadAccounts,
    loadAccountHoldings,
    clearError,
  };
}
