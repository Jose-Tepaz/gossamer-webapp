/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface ModelAsset {
  symbol: string;
  target_percentage: number;
}

export interface UserModel {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_global: boolean;
  broker_id?: string;
  model_data: {
    assets: ModelAsset[];
  };
  created_at: string;
  updated_at: string;
}

export interface CreateModelData {
  name: string;
  description?: string;
  is_global: boolean;
  broker_id?: string;
  model_data: {
    assets: ModelAsset[];
  };
}

export interface UseModelsReturn {
  models: UserModel[];
  loading: boolean;
  error: string | null;
  isHydrated: boolean;
  createModel: (data: CreateModelData) => Promise<UserModel | null>;
  updateModel: (id: string, data: Partial<CreateModelData>) => Promise<UserModel | null>;
  getModel: (id: string) => Promise<UserModel | null>;
  deleteModel: (id: string) => Promise<boolean>;
  loadModels: () => Promise<void>;
  refreshModels: () => Promise<void>;
  getModelsForBroker: (brokerId: string) => UserModel[];
  getGlobalModels: () => UserModel[];
}

export function useModels(): UseModelsReturn {
  const { user } = useAuth();
  const [models, setModels] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cargar modelos
  const loadModels = useCallback(async () => {
    if (!user?.id) {
      console.log('🔄 No hay usuario, saltando carga de modelos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Cargando modelos para usuario:', user.id);
      const response = await fetch(`/api/models?user_id=${user.id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Modelos cargados:', data.models);
      setModels(data.models || []);

    } catch (err: unknown) {
      console.error('❌ Error cargando modelos:', err);
      setError((err as any).message || 'Error cargando modelos');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Crear modelo
  const createModel = useCallback(async (data: CreateModelData): Promise<UserModel | null> => {
    if (!user?.id) {
      setError('Usuario no autenticado');
      return null;
    }

    try {
      console.log('🔄 Creando modelo:', data);
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Modelo creado:', result.model);
      
      // Actualizar la lista local
      setModels(prev => [result.model, ...prev]);
      
      return result.model;

    } catch (err: unknown) {
      console.error('❌ Error creando modelo:', err);
      setError((err as any).message || 'Error creando modelo');
      return null;
    }
  }, [user?.id]);

  // Actualizar modelo
  const updateModel = useCallback(async (id: string, data: Partial<CreateModelData>): Promise<UserModel | null> => {
    try {
      console.log('🔄 Actualizando modelo:', id, data);
      const response = await fetch(`/api/models/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Modelo actualizado:', result.model);
      
      // Actualizar la lista local
      setModels(prev => prev.map(model => 
        model.id === id ? result.model : model
      ));
      
      return result.model;

    } catch (err: unknown) {
      console.error('❌ Error actualizando modelo:', err);
      setError((err as any).message || 'Error actualizando modelo');
      return null;
    }
  }, []);

  // Obtener modelo por ID
  const getModel = useCallback(async (id: string): Promise<UserModel | null> => {
    try {
      console.log('🔄 Obteniendo modelo:', id);
      const response = await fetch(`/api/models/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Modelo obtenido:', result.model);
      
      return result.model;

    } catch (err: unknown) {
      console.error('❌ Error obteniendo modelo:', err);
      setError((err as any).message || 'Error obteniendo modelo');
      return null;
    }
  }, []);

  // Eliminar modelo
  const deleteModel = useCallback(async (id: string): Promise<boolean> => {
    try {
      console.log('🔄 Eliminando modelo:', id);
      const response = await fetch(`/api/models/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      console.log('✅ Modelo eliminado');
      
      // Actualizar la lista local
      setModels(prev => prev.filter(model => model.id !== id));
      
      return true;

    } catch (err: unknown) {
      console.error('❌ Error eliminando modelo:', err);
      setError((err as any).message || 'Error eliminando modelo');
      return false;
    }
  }, []);

  // Refrescar modelos
  const refreshModels = useCallback(async () => {
    await loadModels();
  }, [loadModels]);

  // Obtener modelos para un broker específico (incluye globales)
  const getModelsForBroker = useCallback((brokerId: string): UserModel[] => {
    const filteredModels = models.filter(model => 
      model.is_global || model.broker_id === brokerId
    );
    console.log('🔍 getModelsForBroker - brokerId:', brokerId);
    console.log('🔍 getModelsForBroker - todos los modelos:', models);
    console.log('🔍 getModelsForBroker - modelos filtrados:', filteredModels);
    return filteredModels;
  }, [models]);

  // Obtener solo modelos globales
  const getGlobalModels = useCallback((): UserModel[] => {
    return models.filter(model => model.is_global);
  }, [models]);

  // Manejar hidratación
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Cargar modelos cuando cambien los parámetros (solo después de hidratación)
  useEffect(() => {
    if (isHydrated && user?.id) {
      loadModels();
    }
  }, [loadModels, isHydrated, user?.id]);

  return {
    models,
    loading,
    error,
    isHydrated,
    createModel,
    updateModel,
    getModel,
    deleteModel,
    loadModels,
    refreshModels,
    getModelsForBroker,
    getGlobalModels,
  };
}
