"use client"

import { useAuth } from "@/hooks/useAuth"
import { useUserData } from "@/hooks/useUserData"
import { useBrokerConnections } from "@/hooks/useBrokerConnections"
import { snapTradeService } from "@/lib/snaptrade-service"

export default function DebugBrokersPage() {
  const { user } = useAuth()
  const { userData } = useUserData()
  const { connectedBrokers, accounts, connections, loading, error } = useBrokerConnections()

  const testSnapTradeAPI = async () => {
    if (!user?.id || !userData?.user_secret) {
      console.log('❌ No hay usuario o userSecret');
      return;
    }

    try {
      console.log('🔄 Probando API de SnapTrade...');
      const result = await snapTradeService.listAccounts(user.id, userData.user_secret);
      console.log('📊 Resultado de SnapTrade:', result);
    } catch (error) {
      console.error('❌ Error en SnapTrade:', error);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Brokers</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">User Info:</h2>
          <p>User ID: {user?.id || 'No user'}</p>
          <p>User Secret: {userData?.user_secret || 'No secret'}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Broker Connections:</h2>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
          <p>Connected Brokers: {JSON.stringify(connectedBrokers)}</p>
          <p>Connections: {JSON.stringify(connections)}</p>
          <p>Accounts: {JSON.stringify(accounts, null, 2)}</p>
        </div>

        <button 
          onClick={testSnapTradeAPI}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test SnapTrade API
        </button>
      </div>
    </div>
  )
}
