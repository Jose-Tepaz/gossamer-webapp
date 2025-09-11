/* eslint-disable @typescript-eslint/no-explicit-any */
        import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
        import { Button } from "@/components/ui/button";
        import { ArrowLeft, CheckCircle2, Search, Building2, Landmark, Wallet, Banknote, ExternalLink } from "lucide-react";
        import { Label } from "@/components/ui/label";
        import { Input } from "@/components/ui/input";
        import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSnapTrade } from "@/hooks/useSnapTrade";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { useBrokerConnections } from "@/hooks/useBrokerConnections";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SnapTradeReact } from "snaptrade-react";

type Broker = {
  id: string
  name: string
  tagline: string
  icon: React.ReactNode
  connected?: boolean
}

// Removemos las funciones de localStorage ya que ahora usamos datos dinámicos

const brokers: Broker[] = [
  { id: "BINANCE", name: "Binance", tagline: "World's largest cryptocurrency exchange.", icon: <Wallet className="h-5 w-5" /> },
  { id: "ALPACA", name: "Alpaca", tagline: "Commission-free stock trading API.", icon: <Landmark className="h-5 w-5" /> },
  { id: "ETRADE", name: "E*TRADE", tagline: "Sync your E*TRADE portfolio.", icon: <Building2 className="h-5 w-5" /> },
  { id: "ROBINHOOD", name: "Robinhood", tagline: "Commission-free trading platform.", icon: <Wallet className="h-5 w-5" /> }, 
  { id: "WEBULL", name: "Webull", tagline: "Advanced trading tools and analytics.", icon: <Building2 className="h-5 w-5" /> },
  { id: "COINBASE", name: "Coinbase", tagline: "Options and futures trading platform.", icon: <Banknote className="h-5 w-5" /> },
  
]

interface ConnectBrokerProps {
  onBrokerConnect?: (brokerName: string) => void;
  onContinue?: () => void;
  onSkip?: () => void;
  showBackButton?: boolean;
  showContinueButton?: boolean;
  showSkipButton?: boolean;
}

export default function ConnectBroker({ 
  onBrokerConnect, 
  onContinue, 
  onSkip,
  showBackButton = true, 
  showContinueButton = true,
  showSkipButton = false
}: ConnectBrokerProps) {
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const { } = useAuth();
    const { userData, loading: userDataLoading } = useUserData();
    const { getConnectPortalUrl, error } = useSnapTrade();
    const [query, setQuery] = useState("");
    const { 
      connections, 
      connectedCount, 
      loading: connectionsLoading, 
      error: connectionsError,
      isHydrated: connectionsHydrated,
      updateConnection,
      refreshAccounts 
    } = useBrokerConnections();
    const [connecting, setConnecting] = useState<string | null>(null);
    const [portalUrl, setPortalUrl] = useState<string>('');
    const [isSnapTradeModalOpen, setIsSnapTradeModalOpen] = useState<boolean>(false);
    
    
    const [connectionError, setConnectionError] = useState<string>('');
    
    // Manejar hidratación
    useEffect(() => {
      setIsHydrated(true);
    }, []);

    // Debug: useEffect para monitorear cambios en portalUrl (solo en desarrollo)
    useEffect(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 useEffect - portalUrl changed to:', portalUrl);
        if (portalUrl === null || portalUrl === '') {
          console.log('⚠️ portalUrl fue reseteado a:', portalUrl);
          console.trace('Stack trace del reset:');
        }
      }
    }, [portalUrl]);
    // connectedCount ahora viene del hook useBrokerConnections
    const filtered = brokers.filter(b => b.name.toLowerCase().includes(query.toLowerCase()));

    // Verificar si el usuario está registrado en SnapTrade
    const isRegisteredInSnapTrade = userData?.user_secret ? true : false;

    // Callbacks para el modal de SnapTrade
    const handleSnapTradeSuccess = (data: unknown) => {
      console.log('✅ Conexión exitosa con SnapTrade:', data);
      // Marcar el broker como conectado y refrescar las cuentas
      const currentBrokerId = connecting;
      if (currentBrokerId) {
        updateConnection(currentBrokerId, true);
        refreshAccounts(); // Refrescar las cuentas desde la API
        
        if (onBrokerConnect) {
          const brokerName = brokers.find(b => b.id === currentBrokerId)?.name || currentBrokerId;
          onBrokerConnect(brokerName);
        }
      }
      // Cerrar el modal
      setIsSnapTradeModalOpen(false);
      setConnecting(null);
    };

    const handleSnapTradeError = (error: unknown) => {
      console.error('❌ Error en conexión con SnapTrade:', error);
      setConnectionError(`Error conectando con el broker: ${(error as any).description || (error as any).message || 'Error desconocido'}`);
      setIsSnapTradeModalOpen(false);
      setConnecting(null);
    };

    const handleSnapTradeExit = () => {
      console.log('🚪 Usuario salió del flujo de SnapTrade');
      setIsSnapTradeModalOpen(false);
      setConnecting(null);
    };

    const handleSnapTradeClose = () => {
      console.log('❌ Modal de SnapTrade cerrado');
      setIsSnapTradeModalOpen(false);
      setConnecting(null);
    };

    async function toggle(id: string) {
      const isConnecting = !connections[id];
      
      if (isConnecting) {
        // Verificar que el usuario esté registrado en SnapTrade
        if (!isRegisteredInSnapTrade) {
          setConnectionError('Usuario no registrado en SnapTrade. Debe registrarse primero.');
          return;
        }

        if (!userData?.user_secret) {
          setConnectionError('No se encontró userSecret. Debe registrarse en SnapTrade primero.');
          return;
        }

        // Mostrar estado de conexión solo para este broker específico
        setConnecting(id);
        setConnectionError('');
        
        try {
          console.log('🔄 Iniciando conexión con broker:', id);
          console.log('🔄 User ID:', userData?.user_id);
          console.log('🔄 User Secret:', userData?.user_secret);
          
          // Obtener URL del portal de SnapTrade con userSecret
          const url = await getConnectPortalUrl({
            broker: id, // Usar el ID del broker (ej: "BINANCE")
            immediateRedirect: false,
          });
          
          console.log('✅ URL del portal obtenida:', url);
          console.log('🔍 Tipo de URL:', typeof url);
          console.log('🔍 URL es válida:', url && typeof url === 'string' && url.startsWith('http'));
          
          // Validar que la URL sea válida
          if (!url || typeof url !== 'string' || !url.startsWith('http')) {
            throw new Error(`URL del portal inválida: ${url}`);
          }
          
          // Establecer la URL y abrir el modal de SnapTrade
          setPortalUrl(url);
          setIsSnapTradeModalOpen(true);
          
        } catch (error: unknown) {
          
          setConnectionError((error as any).message || 'Error conectando con el broker');
          setConnecting(null);
          }
      } else {
        // Desconectar inmediatamente
        updateConnection(id, false);
        refreshAccounts(); // Refrescar las cuentas desde la API
      }
    }

    // Evitar hidratación mismatch mostrando un estado de carga inicial
    if (!isHydrated || !connectionsHydrated) {
    return (
        <Card className="w-full max-w-3xl rounded-2xl shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Back" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-2xl md:text-3xl">Connect Brokerage</CardTitle>
            </div>
            <p className="text-muted-foreground">
              Choose your broker to securely connect and sync your portfolio.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Cargando...</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
        <>
        <Card className="w-full max-w-3xl rounded-2xl shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Back" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-2xl md:text-3xl">Connect Brokerage</CardTitle>
            </div>
            <p className="text-sm md:text-base text-[#444] mt-1">
              Choose your broker to securely connect and sync your portfolio.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Loading State */}
            {userDataLoading && (
              <Alert>
                <AlertDescription>Cargando datos del usuario...</AlertDescription>
              </Alert>
            )}

            {/* Connections Loading State */}
            {connectionsLoading && (
              <Alert>
                <AlertDescription>Cargando cuentas conectadas...</AlertDescription>
              </Alert>
            )}

            {/* Connections Error State */}
            {connectionsError && (
              <Alert variant="destructive">
                <AlertDescription>Error cargando cuentas: {connectionsError}</AlertDescription>
              </Alert>
            )}

            {/* SnapTrade Registration Status */}
            {!userDataLoading && !isRegisteredInSnapTrade && (
              <Alert variant="destructive">
                <AlertDescription>
                  Usuario no registrado en SnapTrade. Debe registrarse primero para conectar brokers.
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Connection Error */}
            {connectionError && (
              <Alert variant="destructive">
                <AlertDescription>{connectionError}</AlertDescription>
              </Alert>
            )}

            {/* URL del Portal Generada - Solo para validación log en front 
            {portalUrl && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">✅ URL del Portal Generada:</p>
                    <div className="bg-gray-100 p-3 rounded border break-all text-sm">
                      {portalUrl}
                    </div>
                    <p className="text-xs text-gray-600">
                      Esta URL se generó correctamente. En producción, el usuario será redirigido automáticamente a esta URL.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
              */}

            {/* Search */}
            <div className="grid gap-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search broker..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Listado de brokers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((b) => {
                const isConnected = !!connections[b.id]
                return (
                  <div
                    key={b.id}
                    className="rounded-lg border bg-[#f7f7f7] p-4 flex items-start gap-3"
                  >
                    <div className="mt-0.5 shrink-0 rounded-md bg-white size-9 grid place-items-center border">
                      {b.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium truncate">{b.name}</div>
                        {isConnected ? (
                          <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
                            <CheckCircle2 className="h-4 w-4" />
                            Connected
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-[#444] mt-1">{b.tagline}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          size="sm"
                          className="text-white"
                          style={{ backgroundColor: isConnected ? "#0ea5e9" : "#872eec" }}
                          onClick={() => toggle(b.id)}
                          disabled={isConnected || connecting === b.id || !isRegisteredInSnapTrade}
                        >
                          {connecting === b.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Connecting...
                            </>
                          ) : isConnected ? (
                            "Disconnect"
                          ) : (
                            <>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Connect
                            </>
                          )}
                        </Button>
                        
                      </div>
                    </div>
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <div className="col-span-full text-sm text-muted-foreground">
                  No brokers found.
                </div>
              )}
            </div>

            {/* Footer acciones */}
            {(showBackButton || showSkipButton || showContinueButton) && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                {showBackButton && (
                  <Button variant="ghost" className="order-2 sm:order-1" onClick={() => router.back()}>
                    Back
                  </Button>
                )}
                <div className="flex-1" />
                {showSkipButton && (
                  <Button
                    variant="outline"
                    className="order-1 sm:order-2 mr-2"
                    onClick={onSkip}
                  >
                    Skip for now
                  </Button>
                )}
                {showContinueButton && (
                  <Button
                    className="order-1 sm:order-2 text-white"
                    style={{ backgroundColor: "#872eec" }}
                    disabled={connectedCount === 0 || !isRegisteredInSnapTrade}
                    onClick={onContinue || (() => router.push("/connect-broker/success"))}
                  >
                    Continue {connectedCount > 0 ? `(${connectedCount} connected)` : ""}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de SnapTrade */}
        {portalUrl && (
          <SnapTradeReact
            loginLink={portalUrl}
            isOpen={isSnapTradeModalOpen}
            close={handleSnapTradeClose}
            onSuccess={handleSnapTradeSuccess}
            onError={handleSnapTradeError}
            onExit={handleSnapTradeExit}
            contentLabel="Conectar cuenta de corretaje via SnapTrade"
          />
        )}
        </>
    )
}