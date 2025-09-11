'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { UserData } from '@/types/supabase';
import { getUserDataFromSupabase } from '@/lib/memberstack-supabase-sync';

export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del usuario desde Supabase
  const loadUserData = useCallback(async () => {
    if (!user) {
      setUserData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUserDataFromSupabase(user.id);
      setUserData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando datos del usuario';
      setError(errorMessage);
      console.error('Error cargando datos del usuario:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Cargar datos automáticamente cuando el usuario cambia
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setUserData(null);
      setError(null);
    }
  }, [user, loadUserData]);

  // Función para actualizar datos del usuario
  const updateUserData = async (updates: Partial<UserData>) => {
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      const { UserDataApiService } = await import('@/lib/user-data-api-service');
      const updatedData = await UserDataApiService.updateUser(user.id, updates as any);
      
      if (updatedData) {
        setUserData(updatedData);
        return updatedData;
      } else {
        throw new Error('No se pudo actualizar el usuario');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando datos del usuario';
      setError(errorMessage);
      console.error('Error actualizando datos del usuario:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el user_secret (ID de SnapTrade)
  const updateUserSecret = async (userSecret: string) => {
    return updateUserData({ user_secret: userSecret });
  };

  // Función para refrescar datos
  const refreshUserData = () => {
    loadUserData();
  };

  return {
    userData,
    loading,
    error,
    updateUserData,
    updateUserSecret,
    refreshUserData,
    hasUserData: !!userData,
    isSnapTradeConnected: !!userData?.user_secret,
  };
};
