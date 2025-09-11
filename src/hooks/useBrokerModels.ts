/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface BrokerModel {
  id: string;
  user_id: string;
  broker_id: string;
  model_id: string;
  assigned_at: string;
  user_models: {
    id: string;
    name: string;
    model_data: any;
    is_global: boolean;
    broker_id: string | null;
  };
}

export interface UseBrokerModelsReturn {
  assignedModel: BrokerModel | null;
  assignedModels: BrokerModel[]; // Todas las asignaciones del usuario
  loading: boolean;
  error: string | null;
  assignModel: (brokerId: string, modelId: string) => Promise<boolean>;
  unassignModel: (brokerId: string) => Promise<boolean>;
  refreshAssignedModel: (brokerId: string) => Promise<void>;
  loadAllAssignedModels: () => Promise<void>;
  getAssignedModelForBroker: (brokerId: string) => BrokerModel | null;
}

export function useBrokerModels(): UseBrokerModelsReturn {
  const { user } = useAuth();
  const [assignedModel, setAssignedModel] = useState<BrokerModel | null>(null);
  const [assignedModels, setAssignedModels] = useState<BrokerModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener modelo asignado a un broker
  const getAssignedModel = useCallback(async (brokerId: string): Promise<BrokerModel | null> => {
    if (!user?.id) return null;

    try {
      const response = await fetch(
        `/api/broker-models?user_id=${user.id}&broker_id=${brokerId}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No hay modelo asignado
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      console.error('Error obteniendo modelo asignado:', err);
      return null;
    }
  }, [user?.id]);

  // Asignar modelo a un broker
  const assignModel = useCallback(async (brokerId: string, modelId: string): Promise<boolean> => {
    if (!user?.id) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/broker-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          broker_id: brokerId,
          model_id: modelId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAssignedModel(data.data);
      return true;
    } catch (err: unknown) {
      console.error('Error asignando modelo:', err);
      setError((err as any).message || 'Error asignando modelo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Desasignar modelo de un broker
  const unassignModel = useCallback(async (brokerId: string): Promise<boolean> => {
    if (!user?.id) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/broker-models?user_id=${user.id}&broker_id=${brokerId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setAssignedModel(null);
      return true;
    } catch (err: unknown) {
      console.error('Error desasignando modelo:', err);
      setError((err as any).message || 'Error desasignando modelo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Refrescar modelo asignado
  const refreshAssignedModel = useCallback(async (brokerId: string): Promise<void> => {
    const model = await getAssignedModel(brokerId);
    setAssignedModel(model);
  }, [getAssignedModel]);

  // Cargar todas las asignaciones del usuario
  const loadAllAssignedModels = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      console.log('❌ No user ID, skipping loadAllAssignedModels');
      return;
    }

    console.log('🔄 Loading all assigned models for user:', user.id);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/broker-models?user_id=${user.id}`);
      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('📭 No assignments found (404)');
          setAssignedModels([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Assigned models data:', data);
      setAssignedModels(data.data || []);
    } catch (err) {
      console.error('❌ Error cargando asignaciones:', err);
      setError((err as any).message || 'Error cargando asignaciones');
      setAssignedModels([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Obtener modelo asignado para un broker específico
  const getAssignedModelForBroker = useCallback((brokerId: string): BrokerModel | null => {
    return assignedModels.find(model => model.broker_id === brokerId) || null;
  }, [assignedModels]);

  return {
    assignedModel,
    assignedModels,
    loading,
    error,
    assignModel,
    unassignModel,
    refreshAssignedModel,
    loadAllAssignedModels,
    getAssignedModelForBroker,
  };
}
