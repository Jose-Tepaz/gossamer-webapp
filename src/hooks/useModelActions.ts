import { useMemo } from 'react';
import { ModelAsset } from './useModels';

export interface ModelAction {
  symbol: string;
  targetPercentage: number;
  realPercentage: number;
  difference: number;
  action: 'BUY' | 'SELL' | 'HOLD';
  actionAmount: number; // Porcentaje a ajustar
}

export interface UseModelActionsProps {
  modelAssets: ModelAsset[];
  realAssets: Array<{
    symbol: string;
    realPercentage: number;
  }>;
  threshold?: number; // Umbral mínimo para mostrar acción (default: 1%)
}

export interface UseModelActionsReturn {
  actions: ModelAction[];
  totalBuyAmount: number;
  totalSellAmount: number;
  isBalanced: boolean;
}

export function useModelActions({
  modelAssets,
  realAssets,
  threshold = 1.0
}: UseModelActionsProps): UseModelActionsReturn {
  
  const actions = useMemo(() => {
    const actionList: ModelAction[] = [];
    // let totalBuyAmount = 0;
    // let totalSellAmount = 0;

    // Crear un mapa de assets reales para búsqueda rápida
    const realAssetsMap = new Map(
      realAssets.map(asset => [asset.symbol, asset.realPercentage])
    );

    // Procesar cada asset del modelo
    modelAssets.forEach(modelAsset => {
      const realPercentage = realAssetsMap.get(modelAsset.symbol) || 0;
      const difference = modelAsset.target_percentage - realPercentage;
      const absDifference = Math.abs(difference);

      // Solo mostrar acción si la diferencia supera el umbral
      if (absDifference >= threshold) {
        let action: 'BUY' | 'SELL' | 'HOLD';
        
        if (difference > 0) {
          action = 'BUY';
          // totalBuyAmount += difference;
        } else if (difference < 0) {
          action = 'SELL';
          // totalSellAmount += absDifference;
        } else {
          action = 'HOLD';
        }

        actionList.push({
          symbol: modelAsset.symbol,
          targetPercentage: modelAsset.target_percentage,
          realPercentage,
          difference,
          action,
          actionAmount: absDifference
        });
      }
    });

    // Agregar assets reales que no están en el modelo (para vender)
    realAssets.forEach(realAsset => {
      const isInModel = modelAssets.some(modelAsset => 
        modelAsset.symbol === realAsset.symbol
      );
      
      if (!isInModel && realAsset.realPercentage >= threshold) {
        actionList.push({
          symbol: realAsset.symbol,
          targetPercentage: 0,
          realPercentage: realAsset.realPercentage,
          difference: -realAsset.realPercentage,
          action: 'SELL',
          actionAmount: realAsset.realPercentage
        });
        
        // totalSellAmount += realAsset.realPercentage;
      }
    });

    return actionList;
  }, [modelAssets, realAssets, threshold]);

  const totalBuyAmount = useMemo(() => 
    actions.reduce((sum, action) => 
      action.action === 'BUY' ? sum + action.actionAmount : sum, 0
    ), [actions]
  );

  const totalSellAmount = useMemo(() => 
    actions.reduce((sum, action) => 
      action.action === 'SELL' ? sum + action.actionAmount : sum, 0
    ), [actions]
  );

  const isBalanced = useMemo(() => 
    actions.length === 0 || 
    (Math.abs(totalBuyAmount - totalSellAmount) < 0.1), // Tolerancia de 0.1%
    [actions.length, totalBuyAmount, totalSellAmount]
  );

  return {
    actions,
    totalBuyAmount,
    totalSellAmount,
    isBalanced
  };
}
