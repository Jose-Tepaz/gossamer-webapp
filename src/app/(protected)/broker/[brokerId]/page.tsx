/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EllipsisVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/hooks/useAuth"
import { useBrokerConnections } from "@/hooks/useBrokerConnections"
import { useAccountHoldings } from "@/hooks/useAccountHoldings"
import { useModels } from "@/hooks/useModels"
import { useBrokerModels } from "@/hooks/useBrokerModels"
import { useParams } from "next/navigation"

export default function BrokerPage() {
  const router = useRouter()
  const params = useParams()
  const brokerId = params.brokerId as string
  const [tab, setTab] = useState("overview")
  const { user } = useAuth()
  const { connections, brokerAccountIds, isHydrated } = useBrokerConnections()

  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : "Guest"

  // Evitar problemas de hidratación
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Check if broker is connected
  if (!connections[brokerId]) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Broker Not Connected</h2>
          <p className="text-gray-600 mb-6">
            This broker is not connected. Please connect it first to view its data.
          </p>
          <Button 
            onClick={() => router.push('/connect-broker')}
            style={{ backgroundColor: "#872eec" }}
          >
            Connect Broker
          </Button>
        </Card>
      </div>
    )
  }

  const getBrokerName = (id: string): string => {
    const brokerNames: Record<string, string> = {
      'binance': 'Binance',
      'coinbase': 'Coinbase',
      'kraken': 'Kraken',
      'robinhood': 'Robinhood'
    }
    return brokerNames[id] || id
  }

  const brokerName = getBrokerName(brokerId)

  return (
    <div>
      {/* Welcome card stays for context */}
      <Card
        className="flex items-center justify-between rounded-xl border bg-white"
        style={{ borderColor: "#eeeeee" }}
      >
        <div className="px-4 md:px-6 py-3 md:py-4 text-base md:text-lg font-semibold">
          Welcome {userName ?? "Joe Doe"}
        </div>
      </Card>

      {/* Tabs */}
      <div className="mt-4 md:mt-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-white p-1 rounded-lg border" style={{ borderColor: "#eeeeee" }}>
            <TabsTrigger
              value="overview"
              className="rounded-md data-[state=active]:text-white"
              style={{ backgroundColor: tab === "overview" ? "#872eec" : "transparent" }}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="trade"
              className="rounded-md data-[state=active]:text-white"
              style={{ backgroundColor: tab === "trade" ? "#872eec" : "transparent" }}
            >
              Trade
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-md data-[state=active]:text-white"
              style={{ backgroundColor: tab === "orders" ? "#872eec" : "transparent" }}
            >
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <SectionBroker 
              brokerName={brokerName} 
              brokerId={brokerId} 
              accountId={brokerAccountIds[brokerId] || null}
            />
          </TabsContent>
          <TabsContent value="trade" className="mt-4">
            <PlaceholderPanel title="Trade" />
          </TabsContent>
          <TabsContent value="orders" className="mt-4">
            <PlaceholderPanel title="Orders" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function PlaceholderPanel({ title = "Section" }: { title?: string }) {
  return (
    <Card className="rounded-xl border bg-white p-6" style={{ borderColor: "#eeeeee" }}>
      <p className="text-sm text-[#444444]">
        {"Esta es la pestaña de "}
        {title}
        {". Integraremos la lógica en pasos siguientes."}
      </p>
    </Card>
  )
}

function SectionBroker({
  brokerName, 
  brokerId, 
  accountId 
}: { 
  brokerName: string; 
  brokerId: string; 
  accountId: string | null;
}) {
  const { holdings, loading, error, isHydrated } = useAccountHoldings(accountId);
  const { getModelsForBroker, isHydrated: modelsHydrated } = useModels();
  const { assignedModel, refreshAssignedModel } = useBrokerModels();
  
  // Cargar modelo asignado cuando se monta el componente
  useEffect(() => {
    if (isHydrated && modelsHydrated) {
      refreshAssignedModel(brokerId);
    }
  }, [isHydrated, modelsHydrated, brokerId, refreshAssignedModel]);
  
  // Evitar problemas de hidratación
  if (!isHydrated || !modelsHydrated) {
    return (
      <Card className="rounded-xl border bg-white p-6" style={{ borderColor: "#eeeeee" }}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading broker data...</span>
        </div>
      </Card>
    );
  }

  // Obtener modelos disponibles para este broker (solo después de hidratación)
  const availableModels = getModelsForBroker(brokerId);
  
  // Usar el modelo asignado si existe, sino usar el primer modelo disponible
  const selectedModel = assignedModel?.user_models || availableModels[0];
  
  console.log('🔍 Modelos disponibles para broker:', brokerId, availableModels);
  console.log('🔍 Modelo asignado:', assignedModel);
  console.log('🔍 Modelo seleccionado:', selectedModel);

  // Si no hay accountId, mostrar mensaje
  if (!accountId) {
    return (
      <Card className="rounded-xl border bg-white p-6" style={{ borderColor: "#eeeeee" }}>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No Account Connected</h3>
          <p className="text-gray-600 mb-4">
            This broker is connected but no account ID was found. This might happen if the account connection is incomplete.
          </p>
          <p className="text-sm text-gray-500">
            Try reconnecting your broker account or contact support if the issue persists.
          </p>
        </div>
      </Card>
    );
  }

  // Mostrar error si hay uno
  if (error) {
    const isAccountNotFound = error.includes('404') || error.includes('not found');
    
    return (
      <Card className="rounded-xl border bg-white p-6" style={{ borderColor: "#eeeeee" }}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            {isAccountNotFound ? 'Account Not Found' : 'Error Loading Data'}
          </h3>
          <p className="text-gray-600 mb-4">
            {isAccountNotFound 
              ? 'The account associated with this broker could not be found. This might happen if the account connection is incomplete or has expired.'
              : error
            }
          </p>
          {isAccountNotFound && (
            <p className="text-sm text-gray-500">
              Try reconnecting your broker account or contact support if the issue persists.
            </p>
          )}
        </div>
      </Card>
    );
  }

  // Mostrar loading
  if (loading) {
    return (
      <Card className="rounded-xl border bg-white p-6" style={{ borderColor: "#eeeeee" }}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading holdings...</span>
        </div>
      </Card>
    );
  }

  // Si no hay holdings, mostrar mensaje
  if (!holdings || !holdings.positions || holdings.positions.length === 0) {
    return (
      <Card className="rounded-xl border bg-white p-6" style={{ borderColor: "#eeeeee" }}>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No positions</h3>
          <p className="text-gray-600">No positions in this account currently.</p>
        </div>
      </Card>
    );
  }

  // Debug: Verificar la estructura completa de holdings
  console.log('🔍 Estructura completa de holdings:', holdings);
  console.log('🔍 holdings.total_value:', holdings?.total_value);
  console.log('🔍 holdings.total_value?.value:', holdings?.total_value?.value);
  
  // Calcular el valor total de la cartera (usando 'value' en lugar de 'amount')
  const totalPortfolioValue = holdings.total_value?.value || 0;
  console.log('💰 Valor total de la cartera:', totalPortfolioValue);

  // Preparar datos para el cálculo de acciones del modelo
  const realAssets = holdings?.positions?.map((position) => {
    // Extraer el símbolo de manera segura
    let symbol = 'N/A';
    if (position.symbol) {
      if (typeof position.symbol === 'string') {
        symbol = position.symbol;
      } else if ((position.symbol as unknown as any).symbol && (position.symbol as unknown as any).symbol.description) {
        symbol = (position.symbol as unknown as any).symbol.description;
      } else if ((position.symbol as unknown as any).symbol && (position.symbol as unknown as any).symbol.symbol) {
        symbol = (position.symbol as unknown as any).symbol.symbol;
      } else if ((position.symbol as unknown as any).symbol && (position.symbol as unknown as any).symbol.raw_symbol) {
        symbol = (position.symbol as unknown as any).symbol.raw_symbol;
      } else if ((position.symbol as unknown as any).description) {
        symbol = (position.symbol as unknown as any).description;
      }
    }
    
    // Calcular el porcentaje real
    const positionValue = position.price && position.units ? (position.price * position.units) : 0;
    const realPercentage = totalPortfolioValue > 0 ? (positionValue / totalPortfolioValue) * 100 : 0;
    
    return {
      symbol: String(symbol || 'N/A'),
      realPercentage
    };
  }) || [];

  // Calcular acciones del modelo directamente (sin hook para evitar problemas de hidratación)
  const calculateModelActions = () => {
    console.log('🔍 calculateModelActions - selectedModel:', selectedModel);
    console.log('🔍 calculateModelActions - model_data:', selectedModel?.model_data);
    console.log('🔍 calculateModelActions - assets:', selectedModel?.model_data?.assets);
    console.log('🔍 calculateModelActions - realAssets.length:', realAssets.length);
    
    if (!selectedModel?.model_data?.assets || realAssets.length === 0) {
      console.log('❌ No hay modelo o assets reales, retornando array vacío');
      return [];
    }

    const actionList: unknown[] = [];
    const threshold = 1.0;

    // Crear un mapa de assets reales para búsqueda rápida
    const realAssetsMap = new Map(
      realAssets.map(asset => [asset.symbol, asset.realPercentage])
    );

    // Procesar cada asset del modelo
    selectedModel.model_data.assets.forEach((modelAsset: any) => {
      const realPercentage = realAssetsMap.get(modelAsset.symbol) || 0;
      const difference = modelAsset.target_percentage - realPercentage;
      const absDifference = Math.abs(difference);

      // Solo mostrar acción si la diferencia supera el umbral
      if (absDifference >= threshold) {
        let action: 'BUY' | 'SELL' | 'HOLD';
        
        if (difference > 0) {
          action = 'BUY';
        } else if (difference < 0) {
          action = 'SELL';
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
      const isInModel = selectedModel.model_data.assets.some((modelAsset: any) => 
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
      }
    });

    console.log('✅ calculateModelActions - actionList final:', actionList);
    return actionList;
  };

  const modelActions = calculateModelActions();

  // Crear mapa de acciones para búsqueda rápida
  const actionsMap = new Map(
    modelActions.map((action: any) => [action.symbol, action])
  );
  
  // Agregar todos los assets reales al mapa, incluso si no están en el modelo
  if (holdings?.positions) {
    holdings.positions.forEach((position) => {
      // Extraer el símbolo de la misma manera que en el mapeo de datos
      let symbol = 'N/A';
      if (position.symbol) {
        if (typeof position.symbol === 'string') {
          symbol = position.symbol;
        } else if ((position.symbol as unknown as any).symbol && (position.symbol as unknown as any).symbol.description) {
          symbol = (position.symbol as unknown as any).symbol.description;
        } else if ((position.symbol as unknown as any).symbol && (position.symbol as unknown as any).symbol.symbol) {
          symbol = (position.symbol as unknown as any).symbol.symbol;
        } else if ((position.symbol as unknown as any).symbol && (position.symbol as unknown as any).symbol.raw_symbol) {
          symbol = (position.symbol as unknown as any).symbol.raw_symbol;
        } else if ((position.symbol as unknown as any).description) {
          symbol = (position.symbol as unknown as any).description;
        }
      }
      symbol = String(symbol || 'N/A');
      
      // Si el símbolo no está en el mapa, agregarlo con target 0%
      if (!actionsMap.has(symbol)) {
        const positionValue = position.price && position.units ? (position.price * position.units) : 0;
        const realPercentage = totalPortfolioValue > 0 && positionValue > 0 ? (positionValue / totalPortfolioValue) * 100 : 0;
        
        actionsMap.set(symbol, {
          symbol,
          targetPercentage: 0,
          realPercentage,
          difference: -realPercentage,
          action: 'SELL',
          actionAmount: realPercentage
        });
      }
    });
  }

  // Convertir los datos de SnapTrade al formato esperado por la tabla
  const data = holdings?.positions?.map((position) => {
    console.log('🔍 Procesando posición:', position);
    
    // Extraer el símbolo de manera segura
    let symbol = 'N/A';
    if (position.symbol) {
      if (typeof position.symbol === 'string') {
        symbol = position.symbol;
      } else if ((position.symbol as unknown as any).symbol && (position.symbol as unknown as any).symbol.description) {
        // Usar la descripción (nombre largo) del símbolo
        symbol = (position.symbol as unknown as any).symbol.description;
      } else if ((position.symbol as unknown as any).symbol && (position.symbol as unknown as any).symbol.symbol) {
        // Fallback al símbolo corto si no hay descripción
        symbol = (position.symbol as unknown as any).symbol.symbol;
      } else if ((position.symbol as unknown as any).symbol && (position.symbol as unknown as any).symbol.raw_symbol) {
        // Fallback al raw_symbol
        symbol = (position.symbol as unknown as any).symbol.raw_symbol;
      } else if ((position.symbol as unknown as any).description) {
        symbol = (position.symbol as unknown as any).description;
      }
    }
    
    // Asegurar que symbol sea siempre una cadena
    symbol = String(symbol || 'N/A');
    
    // Extraer las unidades
    const units = String(position.units?.toString() || '0');
    
    // Extraer el precio y formatear con comas para los miles
    const price = position.price
      ? `$${position.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '$0.00';
      
    // Calcular el valor de la posición
    const positionValue = position.price && position.units ? (position.price * position.units) : 0;
    const value = `$${positionValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    // Calcular el porcentaje que representa esta posición del total
    let realPercentage = '0%';
    if (totalPortfolioValue > 0 && positionValue > 0) {
      const percentage = (positionValue / totalPortfolioValue) * 100;
      realPercentage = `${percentage.toFixed(1)}%`;
    }

    // Obtener target y action del modelo
    const modelAction = actionsMap.get(symbol);
    const target = modelAction ? `${modelAction.targetPercentage.toFixed(1)}%` : '0.0%';
    const action = modelAction ? modelAction.action.toLowerCase() as 'buy' | 'sell' | 'none' : 'none';
    
    const mappedData = {
      symbol,
      units,
      price,
      value,
      target,
      real: realPercentage,
      action
    };
    
    console.log('✅ Datos mapeados:', mappedData);
    return mappedData;
  }) || [];
  
  console.log('📊 Datos finales para la tabla:', data);

  return (
    <Card className="rounded-xl border bg-white" style={{ borderColor: "#eeeeee" }}>
      {/* Header */}
      <div className="flex items-start gap-2 px-4 md:px-6 pt-4 md:pt-5">
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold">{brokerName}</h2>
          <p className="text-sm text-[#444444] mt-1">
            {"Portfolio overview and trading data for "}{brokerName}
          </p>
          {holdings?.total_value && (
            <p className="text-sm font-medium text-green-600 mt-1">
              Total Value: ${holdings.total_value.value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'} {holdings.total_value.currency || 'USD'}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="rounded-md" style={{ backgroundColor: "#872eec", color: "#ffffff" }}>
            <Link href={selectedModel ? `/models/edit?modelId=${selectedModel.id}&broker_id=${brokerId}` : `/models/edit?broker_id=${brokerId}`}>
              {selectedModel ? 'Edit Model' : 'Create Model'}
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={`/models?broker_id=${brokerId}`}>Apply Model</Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More">
                <EllipsisVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table (scrollable on mobile) */}
      <div className="px-2 md:px-4 pb-4 md:pb-6">
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Real</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                  <Row
                    key={index}
                    symbol={row.symbol}
                    units={row.units}
                    price={row.price}
                    value={row.value}
                    target={row.target}
                    real={row.real}
                    action={{ type: row.action as "buy" | "sell" | "none" }}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Card>
  )
}

function Row({
  symbol,
  units,
  price,
  value,
  target,
  real,
  action,
}: {
  symbol: string
  units: string
  price: string
  value: string
  target: string
  real: string
  action: { type: "buy" | "sell" | "none" }
}) {
  // Asegurar que todos los valores sean cadenas
  const safeSymbol = String(symbol || 'N/A');
  const safeUnits = String(units || '0');
  const safePrice = String(price || '$0.00');
  const safeValue = String(value || '$0.00');
  const safeTarget = String(target || 'N/A');
  const safeReal = String(real || 'N/A');
  
  console.log('🔍 Row renderizando:', { safeSymbol, safeUnits, safePrice, safeValue, safeTarget, safeReal });
  
  return (
    <TableRow>
      <TableCell className="font-medium">{safeSymbol}</TableCell>
      <TableCell>{safeUnits}</TableCell>
      <TableCell>{safePrice}</TableCell>
      <TableCell>{safeValue}</TableCell>
      <TableCell className="font-medium" style={{ backgroundColor: "#b2d1ff" }}>
        {safeTarget}
      </TableCell>
      <TableCell className="font-medium" style={{ backgroundColor: "#d1ffbc" }}>
        {safeReal}
      </TableCell>
      <TableCell className="text-right">
        {action.type === "buy" ? (
          <Button size="sm" className="rounded-md" style={{ backgroundColor: "#d1ffbc", color: "#064e3b" }}>
            Buy
          </Button>
        ) : action.type === "sell" ? (
          <Button size="sm" className="rounded-md" style={{ backgroundColor: "#ff8888", color: "#7f1d1d" }}>
            Sell
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            className="rounded-md"
            style={{ backgroundColor: "#d2c7c7", color: "#444444" }}
          >
            None
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}
