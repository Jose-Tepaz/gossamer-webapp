/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useUserData } from './useUserData';
import { snapTradeService } from '@/lib/snaptrade-service';

export interface BrokerAccount {
  id: string;
  name: string;
  type: string;
  broker: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrokerConnections {
  [brokerId: string]: boolean;
}

export function useBrokerConnections() {
  const { user } = useAuth();
  const { userData } = useUserData();
  const [accounts, setAccounts] = useState<BrokerAccount[]>([]);
  const [connections, setConnections] = useState<BrokerConnections>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Función para cargar cuentas desde SnapTrade
  const loadAccounts = useCallback(async () => {
    console.log('🔄 loadAccounts - user:', user?.id);
    console.log('🔄 loadAccounts - userData:', userData);
    console.log('🔄 loadAccounts - user_secret:', userData?.user_secret);
    
    if (!user?.id || !userData?.user_secret) {
      console.log('🔄 No hay usuario o userSecret, saltando carga de cuentas');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Cargando cuentas desde SnapTrade...');
      const accountsData = await snapTradeService.listAccounts(
        user.id,
        userData.user_secret
      );

      console.log('✅ Cuentas cargadas:', accountsData);
      
      // La API devuelve { accounts: [...] }, necesitamos extraer el array
      const accountsArray = (accountsData as any)?.accounts || [];
      setAccounts(accountsArray);

      // Crear mapa de conexiones basado en las cuentas reales
      const newConnections: BrokerConnections = {};
      if (accountsArray && Array.isArray(accountsArray)) {
        accountsArray.forEach((account: any) => {
          console.log('🔍 Procesando cuenta:', account);
          
          // Usar institution_name directamente (está siempre disponible)
          const brokerId = account.institution_name?.toLowerCase();
          
          if (brokerId) {
            newConnections[brokerId] = true;
            console.log('✅ Broker conectado:', brokerId);
          } else {
            console.log('❌ No se encontró institution_name en la cuenta:', account);
          }
        });
      }
      console.log('📊 Conexiones finales:', newConnections);
      setConnections(newConnections);

    } catch (err: unknown) {
      console.error('❌ Error cargando cuentas:', err);
      setError((err as any).message || 'Error cargando cuentas');
    } finally {
      setLoading(false);
    }
  }, [user?.id, userData?.user_secret]);

  // Función para actualizar una conexión específica
  const updateConnection = useCallback((brokerId: string, isConnected: boolean) => {
    setConnections(prev => ({
      ...prev,
      [brokerId]: isConnected
    }));
  }, []);

  // Función para refrescar las cuentas
  const refreshAccounts = useCallback(() => {
    loadAccounts();
  }, [loadAccounts]);

  // Manejar hidratación
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Cargar cuentas cuando el usuario o userSecret cambien (solo después de hidratación)
  useEffect(() => {
    if (isHydrated) {
      loadAccounts();
    }
  }, [loadAccounts, isHydrated]);

  // Obtener brokers conectados con información detallada
  const connectedBrokers = Object.keys(connections).filter(brokerId => connections[brokerId]);
  const connectedCount = connectedBrokers.length;
  
  console.log('🔍 useBrokerConnections - connections:', connections);
  console.log('🔍 useBrokerConnections - connectedBrokers:', connectedBrokers);
  console.log('🔍 useBrokerConnections - connectedCount:', connectedCount);
  
  // Crear mapa de brokers con información detallada
  const brokerDetails = (Array.isArray(accounts) ? accounts : []).reduce((acc, account) => {
    // Determinar el broker ID usando la misma lógica que arriba
    let brokerId = null;
    
    if ((account as any).brokerage?.slug) {
      brokerId = (account as any).brokerage.slug;
    } else if ((account as any).institution_name) {
      brokerId = (account as any).institution_name.toLowerCase();
    } else if (account.broker) {
      brokerId = account.broker.toLowerCase();
    }
    
    if (brokerId) {
      acc[brokerId] = {
        id: brokerId,
        name: (account as any).brokerage?.display_name || (account as any).institution_name || account.broker || 'Broker Desconocido',
        description: (account as any).brokerage?.description || '',
        logo: (account as any).brokerage?.aws_s3_logo_url || '',
        accountName: account.name,
        accountId: account.id
      };
    }
    return acc;
  }, {} as Record<string, unknown>);

  // Crear mapa de accountId por broker
  const brokerAccountIds = (Array.isArray(accounts) ? accounts : []).reduce((acc, account) => {
    let brokerId = null;
    
    console.log('🔍 Procesando cuenta para brokerAccountIds:', {
      accountId: account.id,
      institution_name: (account as any).institution_name,
      brokerage: (account as any).brokerage,
      broker: account.broker
    });
    
    if ((account as any).brokerage?.slug) {
      brokerId = (account as any).brokerage.slug;
      console.log('✅ Broker ID desde brokerage.slug:', brokerId);
    } else if ((account as any).institution_name) {
      brokerId = (account as any).institution_name.toLowerCase();
      console.log('✅ Broker ID desde institution_name:', brokerId);
    } else if (account.broker) {
      brokerId = account.broker.toLowerCase();
      console.log('✅ Broker ID desde broker:', brokerId);
    }
    
    if (brokerId) {
      acc[brokerId] = account.id;
      console.log('✅ Mapeado:', brokerId, '->', account.id);
    }
    return acc;
  }, {} as Record<string, string>);
  
  console.log('📋 brokerAccountIds final:', brokerAccountIds);

  return {
    accounts,
    connections,
    connectedBrokers,
    connectedCount,
    brokerDetails,
    brokerAccountIds,
    loading,
    error,
    isHydrated,
    updateConnection,
    refreshAccounts,
    loadAccounts
  };
}