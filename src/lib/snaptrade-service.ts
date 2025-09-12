/**
 * Servicio para interactuar con la API de SnapTrade a través del backend
 */

import { getSnapTradeUrls } from './config';

export interface SnapTradeUser {
  userId: string;
  userSecret: string;
}

export interface ConnectPortalUrlRequest {
  userId: string;
  userSecret: string;
  broker?: string;
  immediateRedirect?: boolean;
  customRedirect?: string;
  reconnect?: string;
}

export interface ConnectPortalUrlResponse {
  redirectURI: string;
}

export interface BrokerageAccount {
  id: string;
  brokerage_authorization: {
    id: string;
    name: string;
    type: string;
  };
  name: string;
  number: string;
  institution_name: string;
}

export interface AccountHolding {
  symbol: {
    id: string;
    symbol: string;
    raw_symbol: string;
    description: string;
  };
  units: number;
  price: number;
  open_pnl: number;
  fractional_units: number;
}

export interface AccountHoldingsResponse {
  account: BrokerageAccount;
  balances: Array<{
    currency: {
      id: string;
      code: string;
      name: string;
    };
    cash: number;
    buying_power: number;
  }>;
  positions: AccountHolding[];
  orders: unknown[];
  total_value: {
    value: number;
    currency: string;
  };
}

class SnapTradeService {
  private urls: ReturnType<typeof getSnapTradeUrls>;

  constructor(useMock: boolean = false) {
    this.urls = getSnapTradeUrls(useMock);
    console.log('🔧 SnapTradeService inicializado con URLs:', this.urls);
    console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
    console.log('🔧 NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
  }

  /**
   * Registra un nuevo usuario en SnapTrade
   */
  async registerUser(userId: string): Promise<SnapTradeUser> {
    try {
      console.log('🔄 Registrando usuario en SnapTrade:', userId);
      
      const response = await fetch(this.urls.registerUser, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Usuario registrado exitosamente:', data);
      
      return {
        userId: data.userId,
        userSecret: data.userSecret,
      };
    } catch (error) {
      console.error('❌ Error registrando usuario en SnapTrade:', error);
      throw error;
    }
  }

  /**
   * Obtiene la URL del portal de conexión para conectar una cuenta de broker
   */
  async getConnectPortalUrl(request: ConnectPortalUrlRequest): Promise<ConnectPortalUrlResponse> {
    try {
      console.log('🔄 Obteniendo URL del portal de conexión:', request);
      
      const response = await fetch(this.urls.connectPortal, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ URL del portal obtenida:', data);
      console.log('🔍 Tipo de data:', typeof data);
      console.log('🔍 data.redirectUri:', data.redirectUri);
      console.log('🔍 Tipo de redirectUri:', typeof data.redirectUri);
      
      // El backend devuelve { redirectUri: { redirectURI: "url", sessionId: "..." } }, necesitamos extraer la URL
      const result = {
        redirectURI: data.redirectUri.redirectURI || data.redirectUri
      };
      
      console.log('🔍 Resultado final:', result);
      return result;
    } catch (error) {
      console.error('❌ Error obteniendo URL del portal:', error);
      throw error;
    }
  }

  /**
   * Lista todas las cuentas de broker del usuario
   */
  async listAccounts(userId: string, userSecret: string): Promise<BrokerageAccount[]> {
    try {
      console.log('🔄 Listando cuentas del usuario:', userId);
      
      const response = await fetch(`${this.urls.listAccounts}?userId=${encodeURIComponent(userId)}&userSecret=${encodeURIComponent(userSecret)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Cuentas listadas:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error listando cuentas:', error);
      throw error;
    }
  }

  /**
   * Lista los holdings de una cuenta específica
   */
  async listAccountHoldings(accountId: string, userId: string, userSecret: string): Promise<AccountHoldingsResponse> {
    try {
      console.log('🔄 Listando holdings de la cuenta:', accountId);
      
      const response = await fetch(`${this.urls.listHoldings}?accountId=${encodeURIComponent(accountId)}&userId=${encodeURIComponent(userId)}&userSecret=${encodeURIComponent(userSecret)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Holdings listados:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error listando holdings:', error);
      throw error;
    }
  }
}

// Instancia singleton del servicio (usando backend real por defecto)
export const snapTradeService = new SnapTradeService(false);
