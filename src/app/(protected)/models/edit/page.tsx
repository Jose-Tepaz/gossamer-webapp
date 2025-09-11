/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, Plus, Trash2, AlertCircle } from 'lucide-react'
import { useModels, ModelAsset, CreateModelData } from "@/hooks/useModels"
import { useBrokerConnections } from "@/hooks/useBrokerConnections"
import { useAccountHoldings } from "@/hooks/useAccountHoldings"
import { useBrokerModels } from "@/hooks/useBrokerModels"

// Lista de assets populares
const POPULAR_ASSETS = [
  // Criptomonedas
  { symbol: 'BTC', name: 'Bitcoin', category: 'Crypto' },
  { symbol: 'ETH', name: 'Ethereum', category: 'Crypto' },
  { symbol: 'BNB', name: 'Binance Coin', category: 'Crypto' },
  { symbol: 'ADA', name: 'Cardano', category: 'Crypto' },
  { symbol: 'SOL', name: 'Solana', category: 'Crypto' },
  { symbol: 'DOT', name: 'Polkadot', category: 'Crypto' },
  { symbol: 'MATIC', name: 'Polygon', category: 'Crypto' },
  { symbol: 'AVAX', name: 'Avalanche', category: 'Crypto' },
  { symbol: 'LINK', name: 'Chainlink', category: 'Crypto' },
  { symbol: 'UNI', name: 'Uniswap', category: 'Crypto' },
  
  // Acciones populares
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'Stock' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', category: 'Stock' },
  { symbol: 'GOOGL', name: 'Alphabet Inc. (Google)', category: 'Stock' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'Stock' },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'Stock' },
  { symbol: 'META', name: 'Meta Platforms Inc. (Facebook)', category: 'Stock' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'Stock' },
  { symbol: 'NFLX', name: 'Netflix Inc.', category: 'Stock' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', category: 'Stock' },
  { symbol: 'INTC', name: 'Intel Corporation', category: 'Stock' },
  { symbol: 'CRM', name: 'Salesforce Inc.', category: 'Stock' },
  { symbol: 'ADBE', name: 'Adobe Inc.', category: 'Stock' },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.', category: 'Stock' },
  { symbol: 'UBER', name: 'Uber Technologies Inc.', category: 'Stock' },
  { symbol: 'SPOT', name: 'Spotify Technology S.A.', category: 'Stock' },
  
  // ETFs populares
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', category: 'ETF' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', category: 'ETF' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', category: 'ETF' },
  { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', category: 'ETF' },
  { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', category: 'ETF' },
  { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', category: 'ETF' },
  { symbol: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF', category: 'ETF' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', category: 'ETF' },
  { symbol: 'SLV', name: 'iShares Silver Trust', category: 'ETF' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', category: 'ETF' },
  { symbol: 'EFA', name: 'iShares MSCI EAFE ETF', category: 'ETF' },
  { symbol: 'EEM', name: 'iShares MSCI Emerging Markets ETF', category: 'ETF' },
  { symbol: 'XLF', name: 'Financial Select Sector SPDR Fund', category: 'ETF' },
  { symbol: 'XLK', name: 'Technology Select Sector SPDR Fund', category: 'ETF' },
  { symbol: 'XLE', name: 'Energy Select Sector SPDR Fund', category: 'ETF' },
  { symbol: 'XLV', name: 'Health Care Select Sector SPDR Fund', category: 'ETF' },
  { symbol: 'XLI', name: 'Industrial Select Sector SPDR Fund', category: 'ETF' },
  { symbol: 'XLY', name: 'Consumer Discretionary Select Sector SPDR Fund', category: 'ETF' },
  { symbol: 'XLP', name: 'Consumer Staples Select Sector SPDR Fund', category: 'ETF' },
  { symbol: 'XLU', name: 'Utilities Select Sector SPDR Fund', category: 'ETF' },
  { symbol: 'ARKK', name: 'ARK Innovation ETF', category: 'ETF' },
  { symbol: 'ARKQ', name: 'ARK Autonomous Technology & Robotics ETF', category: 'ETF' },
  { symbol: 'ARKW', name: 'ARK Next Generation Internet ETF', category: 'ETF' },
  { symbol: 'ARKG', name: 'ARK Genomic Revolution ETF', category: 'ETF' },
  { symbol: 'ARKF', name: 'ARK Fintech Innovation ETF', category: 'ETF' },
  { symbol: 'TQQQ', name: 'ProShares UltraPro QQQ', category: 'ETF' },
  { symbol: 'SQQQ', name: 'ProShares UltraPro Short QQQ', category: 'ETF' },
  { symbol: 'UPRO', name: 'ProShares UltraPro S&P 500', category: 'ETF' },
  { symbol: 'SPXU', name: 'ProShares UltraPro Short S&P 500', category: 'ETF' },
  { symbol: 'VUG', name: 'Vanguard Growth ETF', category: 'ETF' },
  { symbol: 'VTV', name: 'Vanguard Value ETF', category: 'ETF' },
  { symbol: 'VYM', name: 'Vanguard High Dividend Yield ETF', category: 'ETF' },
  { symbol: 'SCHD', name: 'Schwab U.S. Dividend Equity ETF', category: 'ETF' },
  { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', category: 'ETF' },
  { symbol: 'IEFA', name: 'iShares Core MSCI EAFE IMI Index ETF', category: 'ETF' },
  { symbol: 'IEMG', name: 'iShares Core MSCI Emerging Markets IMI Index ETF', category: 'ETF' },
  { symbol: 'ACWI', name: 'iShares MSCI ACWI ETF', category: 'ETF' },
  { symbol: 'VT', name: 'Vanguard Total World Stock ETF', category: 'ETF' },
];

// Componente para fila de asignación de activos
function AllocationRow({
  asset,
  targetPercentage,
  realPercentage,
  onTargetChange,
  onSymbolChange,
  onRemove,
  canRemove = true,
  isEditable = false,
}: {
  asset: ModelAsset & { realPercentage?: number };
  targetPercentage: string;
  realPercentage?: number;
  onTargetChange: (value: string) => void;
  onSymbolChange?: (symbol: string) => void;
  onRemove: () => void;
  canRemove?: boolean;
  isEditable?: boolean;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar assets basado en el término de búsqueda
  const filteredAssets = POPULAR_ASSETS.filter(assetItem =>
    assetItem.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assetItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedAsset = POPULAR_ASSETS.find(a => a.symbol === asset.symbol);

  return (
    <div className="flex items-center gap-3 border-b last:border-b-0 py-3">
      {/* Target Percentage */}
      <div className="flex items-center gap-1 w-20">
        <Input
          value={targetPercentage}
          onChange={(e) => onTargetChange(e.target.value)}
          className="w-14 px-2 py-1 h-8"
          placeholder="00"
          type="number"
          min="0"
          max="100"
          step="0.1"
        />
        <span className="text-sm text-muted-foreground">%</span>
      </div>
      
      <div className="h-8 w-px bg-border" />
      
      {/* Asset Symbol */}
      <div className="flex-1">
        {isEditable && onSymbolChange ? (
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {selectedAsset ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedAsset.symbol}</span>
                    <span className="text-sm text-muted-foreground">- {selectedAsset.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Select asset...</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="start">
              <div className="p-2">
      <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2"
                />
                <div className="max-h-60 overflow-y-auto">
                  {filteredAssets.map((assetItem) => (
                    <DropdownMenuItem
                      key={assetItem.symbol}
                      onClick={() => {
                        onSymbolChange(assetItem.symbol);
                        setIsDropdownOpen(false);
                        setSearchTerm('');
                      }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{assetItem.symbol}</span>
                        <span className="text-sm text-muted-foreground">{assetItem.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {assetItem.category}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div>
            <div className="font-medium">{asset.symbol}</div>
            {realPercentage !== undefined && (
              <div className="text-sm text-muted-foreground">
                Real: {realPercentage.toFixed(1)}%
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Remove Button */}
      {canRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default function EditModelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modelId = searchParams.get('modelId');
  const brokerId = searchParams.get('broker_id');
  
  const { createModel, updateModel, getModel } = useModels();
  const { brokerAccountIds, isHydrated: connectionsHydrated } = useBrokerConnections();
  const { assignModel, loadAllAssignedModels } = useBrokerModels();
  
  // Obtener accountId para el broker actual
  const accountId = brokerId ? brokerAccountIds[brokerId] : null;
  const { holdings, loading: holdingsLoading } = useAccountHoldings(accountId || '');
  
  // Estado del formulario
  const [modelName, setModelName] = useState('');
  const [modelDescription, setModelDescription] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const [assets, setAssets] = useState<(ModelAsset & { realPercentage?: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPercentage, setTotalPercentage] = useState(0);

  // Cargar modelo existente si se proporciona modelId
  useEffect(() => {
    if (modelId) {
      console.log('🔄 Cargando modelo existente con ID:', modelId);
      const loadExistingModel = async () => {
        try {
          const model = await getModel(modelId);
          console.log('📋 Modelo cargado:', model);
          if (model) {
            setModelName(model.name);
            setModelDescription(model.description || '');
            setIsGlobal(model.is_global);
            setAssets(model.model_data?.assets || []);
            console.log('✅ Modelo cargado en el formulario:', {
              name: model.name,
              description: model.description,
              is_global: model.is_global,
              assets: model.model_data?.assets
            });
          } else {
            console.log('❌ No se encontró el modelo');
            setError('Model not found');
          }
        } catch (error) {
          console.error('❌ Error loading model:', error);
          setError('Error loading model');
        }
      };
      loadExistingModel();
    } else {
      console.log('ℹ️ No hay modelId, creando nuevo modelo');
    }
  }, [modelId, getModel]);

  // Cargar assets de la cuenta cuando se carguen los holdings (solo para nuevos modelos)
  useEffect(() => {
    if (holdings?.positions && !modelId) {
      const accountAssets = holdings.positions.map((position: any) => {
        // Extraer el símbolo de la misma manera que en la página de broker
        const symbol = position.symbol?.symbol?.description || 
                      position.symbol?.symbol?.symbol || 
                      position.symbol?.symbol?.raw_symbol || 
                      position.symbol?.description || 
                      'N/A';
        
        // Calcular el porcentaje real
        const positionValue = position.price && position.units ? (position.price * position.units) : 0;
        const totalValue = holdings.total_value?.value || 0;
        const realPercentage = totalValue > 0 ? (positionValue / totalValue) * 100 : 0;
        
        return {
          symbol,
          target_percentage: 0,
          realPercentage
        };
      });
      
      setAssets(accountAssets);
    }
  }, [holdings, modelId]);

  // Calcular total de porcentajes
  useEffect(() => {
    const total = assets.reduce((sum, asset) => sum + (parseFloat(asset.target_percentage.toString()) || 0), 0);
    setTotalPercentage(total);
  }, [assets]);

  // Actualizar porcentaje de un asset
  const updateAssetPercentage = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAssets(prev => prev.map((asset, i) => 
      i === index ? { ...asset, target_percentage: numValue } : asset
    ));
  };

  // Actualizar símbolo de un asset
  const updateAssetSymbol = (index: number, symbol: string) => {
    setAssets(prev => prev.map((asset, i) => 
      i === index ? { ...asset, symbol } : asset
    ));
  };

  // Agregar nuevo asset
  const addAsset = () => {
    setAssets(prev => [...prev, { symbol: '', target_percentage: 0 }]);
  };

  // Remover asset
  const removeAsset = (index: number) => {
    setAssets(prev => prev.filter((_, i) => i !== index));
  };

  // Guardar modelo
  const handleSave = async () => {
    console.log('🔄 Iniciando guardado de modelo...');
    
    if (!modelName.trim()) {
      setError('El nombre del modelo es requerido');
      return;
    }

    if (assets.length === 0) {
      setError('Debe agregar al menos un activo');
      return;
    }

    if (Math.abs(totalPercentage - 100) > 0.01) {
      setError('Los porcentajes deben sumar exactamente 100%');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const modelData: CreateModelData = {
        name: modelName.trim(),
        description: modelDescription.trim() || undefined,
        is_global: isGlobal,
        broker_id: isGlobal ? undefined : brokerId || undefined,
        model_data: {
          assets: assets.map(asset => ({
            symbol: asset.symbol,
            target_percentage: asset.target_percentage
          }))
        }
      };

      console.log('📝 Datos del modelo a crear:', modelData);

      if (modelId) {
        console.log('🔄 Actualizando modelo existente...');
        await updateModel(modelId, modelData);
      } else {
        console.log('🔄 Creando nuevo modelo...');
        await createModel(modelData);
      }

      console.log('✅ Modelo guardado exitosamente');
      router.push('/models');
    } catch (err: unknown) {
      console.error('❌ Error guardando modelo:', err);
      setError((err as Error).message || 'Error guardando modelo');
    } finally {
      setLoading(false);
    }
  };

  // Asignar modelo a un broker
  const handleAssignToBroker = async (targetBrokerId: string) => {
    if (!modelId) {
      setError('No se puede asignar un modelo que no ha sido guardado');
      return;
    }

    try {
      console.log(`🔄 Asignando modelo ${modelId} a broker ${targetBrokerId}`);
      const success = await assignModel(targetBrokerId, modelId);
      
      if (success) {
        console.log(`✅ Modelo asignado exitosamente a ${targetBrokerId}`);
        // Refresh assignments
        await loadAllAssignedModels();
        // Redirect to broker page
        router.push(`/broker/${targetBrokerId}`);
      } else {
        setError(`Error asignando modelo a ${targetBrokerId}`);
      }
    } catch (error) {
      console.error('Error asignando modelo:', error);
      setError('Error asignando modelo');
    }
  };

  // Mostrar loading si no está hidratado
  if (!connectionsHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Intro card */}
      <Card className="rounded-xl border bg-white mb-4" style={{ borderColor: "#eeeeee" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl md:text-2xl">
            {modelId ? 'Edit Model' : 'Create New Model'}
          </CardTitle>
          <p className="text-sm text-[#444] max-w-3xl">
            A model portfolio is a group of assets and target allocations designed to meet a
            particular investing goal. Once you create a model, you can apply it to a portfolio.
          </p>
          <div className="mt-3">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/models"><ArrowLeft className="h-4 w-4" /> Back to My Models</Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left editor */}
        <Card className="rounded-xl border bg-white lg:col-span-2" style={{ borderColor: "#eeeeee" }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl">Model Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Model Name */}
            <div className="space-y-2">
              <Label htmlFor="model-name">Model Name</Label>
              <Input
                id="model-name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Enter model name"
              />
            </div>

            {/* Model Description */}
            <div className="space-y-2">
              <Label htmlFor="model-description">Description (Optional)</Label>
              <Textarea
                id="model-description"
                value={modelDescription}
                onChange={(e) => setModelDescription(e.target.value)}
                placeholder="Enter model description"
                rows={3}
              />
            </div>

            {/* Global Model Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="global-model"
                checked={isGlobal}
                onCheckedChange={setIsGlobal}
              />
              <Label htmlFor="global-model">Global Model (reusable across brokers)</Label>
            </div>

            {/* Assets Allocation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Asset Allocation</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addAsset}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Asset
                </Button>
              </div>
              
              {assets.length > 0 ? (
                <div className="rounded-md border">
                  {assets.map((asset, index) => (
                    <AllocationRow
                      key={index}
                      asset={asset}
                      targetPercentage={asset.target_percentage.toString()}
                      realPercentage={asset.realPercentage}
                      onTargetChange={(value) => updateAssetPercentage(index, value)}
                      onSymbolChange={(symbol) => updateAssetSymbol(index, symbol)}
                      onRemove={() => removeAsset(index)}
                      canRemove={assets.length > 1}
                      isEditable={!asset.symbol || asset.symbol === ''}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {holdingsLoading ? 'Loading assets...' : 'No assets found. Add assets to create your model.'}
                </div>
              )}

              {/* Total Percentage */}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Total:</span>
                <span className={`font-bold ${Math.abs(totalPercentage - 100) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalPercentage.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-4">
              <Button
                className="text-white"
                style={{ backgroundColor: "#872eec" }}
                onClick={handleSave}
                disabled={loading || Math.abs(totalPercentage - 100) > 0.01}
              >
                {loading ? 'Saving...' : (modelId ? 'Update Model' : 'Create Model')}
              </Button>
              
              {/* Botón de asignación - solo si el modelo ya existe */}
              {modelId && Object.keys(brokerAccountIds).length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Assign to Broker
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {Object.entries(brokerAccountIds).map(([brokerId]) => (
                      <DropdownMenuItem
                        key={brokerId}
                        onClick={() => handleAssignToBroker(brokerId)}
                      >
                        Assign to {brokerId.charAt(0).toUpperCase() + brokerId.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Model Info */}
        <Card className="rounded-xl border bg-white" style={{ borderColor: "#eeeeee" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl">Model Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="font-semibold">Total Assets</div>
              <div className="text-2xl font-bold text-purple-600">{assets.length}</div>
            </div>
            
            <div className="space-y-2">
              <div className="font-semibold">Allocation Status</div>
              <div className={`text-sm ${Math.abs(totalPercentage - 100) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(totalPercentage - 100) < 0.01 ? '✅ Balanced' : '⚠️ Needs adjustment'}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold">Model Type</div>
              <div className="text-sm text-muted-foreground">
                {isGlobal ? 'Global (reusable)' : 'Broker-specific'}
              </div>
            </div>

            {brokerId && (
              <div className="space-y-2">
                <div className="font-semibold">Source Broker</div>
                <div className="text-sm text-muted-foreground capitalize">{brokerId}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

