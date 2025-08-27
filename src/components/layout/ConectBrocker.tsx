        import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
        import { Button } from "@/components/ui/button";
        import { ArrowLeft, CheckCircle2, PlugZap, Search, Building2, Landmark, Wallet, Banknote } from "lucide-react";
        import { Label } from "@/components/ui/label";
        import { Input } from "@/components/ui/input";
        import { useRouter } from "next/navigation";
        import { useState } from "react";

type Broker = {
  id: string
  name: string
  tagline: string
  icon: React.ReactNode
  connected?: boolean
}

const STORAGE_KEY = "connected_brokers"

function loadConnections(): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveConnections(map: Record<string, boolean>) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

const brokers: Broker[] = [
  { id: "binance", name: "Binance", tagline: "Connect your Binance account securely.", icon: <Wallet className="h-5 w-5" /> },
  { id: "coinbase", name: "Coinbase", tagline: "Sync balances and transactions.", icon: <Landmark className="h-5 w-5" /> },
  { id: "kraken", name: "Kraken", tagline: "API keys remain encrypted.", icon: <Building2 className="h-5 w-5" /> },
  { id: "robinhood", name: "Robinhood", tagline: "Link for real-time portfolios.", icon: <Banknote className="h-5 w-5" /> },
]

interface ConnectBrokerProps {
  onBrokerConnect?: (brokerName: string) => void;
  onContinue?: () => void;
  showBackButton?: boolean;
  showContinueButton?: boolean;
}

export default function ConnectBroker({ 
  onBrokerConnect, 
  onContinue, 
  showBackButton = true, 
  showContinueButton = true 
}: ConnectBrokerProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [conn, setConn] = useState(loadConnections());
    const [connecting, setConnecting] = useState<string | null>(null);
    const connectedCount = Object.values(conn).filter(Boolean).length;
    const filtered = brokers.filter(b => b.name.toLowerCase().includes(query.toLowerCase()));

    function toggle(id: string, name: string) {
      const isConnecting = !conn[id];
      
      if (isConnecting) {
        // Mostrar estado de conexión
        setConnecting(id);
        
        // Simular proceso de conexión
        setTimeout(() => {
          setConn(prev => ({ ...prev, [id]: true }));
          saveConnections({ ...conn, [id]: true });
          setConnecting(null);
          
          if (onBrokerConnect) {
            onBrokerConnect(name);
          }
        }, 1500); // 1.5 segundos de simulación
      } else {
        // Desconectar inmediatamente
        const next = { ...conn, [id]: false };
        setConn(next);
        saveConnections(next);
      }
    }

    return (
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
                const isConnected = !!conn[b.id]
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
                          onClick={() => toggle(b.id, b.name)}
                          disabled={connecting === b.id}
                        >
                          {connecting === b.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Connecting...
                            </>
                          ) : isConnected ? (
                            "Disconnect"
                          ) : (
                            "Connect"
                          )}
                        </Button>
                        {!isConnected ? (
                          <Button size="sm" variant="ghost" className="gap-1">
                            <PlugZap className="h-4 w-4" />
                            Use API key
                          </Button>
                        ) : null}
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
            {showBackButton && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Button variant="ghost" className="order-2 sm:order-1" onClick={() => router.back()}>
                  Back
                </Button>
                <div className="flex-1" />
                {showContinueButton && (
                  <Button
                    className="order-1 sm:order-2 text-white"
                    style={{ backgroundColor: "#872eec" }}
                    disabled={connectedCount === 0}
                    onClick={onContinue || (() => router.push("/connect-broker/success"))}
                  >
                    Continue {connectedCount > 0 ? `(${connectedCount} connected)` : ""}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
    )
}