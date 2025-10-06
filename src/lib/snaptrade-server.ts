// Servicio real de SnapTrade para uso en el servidor (API routes)
import { Snaptrade } from "snaptrade-typescript-sdk";

// Interfaces para tipos de error
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

interface PortalResponseData {
  redirectURI?: string;
  redirect_uri?: string;
  url?: string;
  link?: string;
}

// Clase personalizada para errores de SnapTrade
export class SnapTradeError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'SnapTradeError';
  }
}

// Inicializar el cliente de SnapTrade
let snaptrade: Snaptrade | null = null;

export const initializeSnapTrade = () => {
  if (!snaptrade) {
    const clientId = process.env.CLIENT_ID;
    const consumerSecret = process.env.CONSUMER_SECRET;

    console.log('🔧 Configuración de SnapTrade:');
    console.log('CLIENT_ID:', clientId ? '✅ Configurado' : '❌ No configurado');
    console.log('CONSUMER_SECRET:', consumerSecret ? '✅ Configurado' : '❌ No configurado');

    if (!clientId || !consumerSecret) {
      throw new SnapTradeError(
        500, 
        'Variables de entorno faltantes para SnapTrade. Asegúrate de tener CLIENT_ID y CONSUMER_SECRET configurados.'
      );
    }

    try {
      console.log('🔄 Inicializando cliente de SnapTrade...');
      console.log('🔍 CLIENT_ID (primeros 8 chars):', clientId.substring(0, 8) + '...');
      console.log('🔍 CONSUMER_SECRET (primeros 8 chars):', consumerSecret.substring(0, 8) + '...');
      
      snaptrade = new Snaptrade({
        clientId,
        consumerKey: consumerSecret,
      });
      console.log('✅ Cliente de SnapTrade inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando SnapTrade:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      throw new SnapTradeError(500, 'Error inicializando SnapTrade', error);
    }
  }
  return snaptrade;
};

export const getSnapTradeClient = () => {
  if (!snaptrade) {
    return initializeSnapTrade();
  }
  return snaptrade;
};

// Funciones de la API de SnapTrade
export const snapTradeService = {
  // Registrar usuario en SnapTrade
  registerUser: async (userId: string) => {
    const client = getSnapTradeClient();
    console.log('🔄 Registrando usuario en SnapTrade:', userId);
    
    try {
      const response = await client.authentication.registerSnapTradeUser({ 
        userId: userId.toString() 
      });
      
      console.log('✅ Usuario registrado exitosamente en SnapTrade');
      const { userId: returnedUserId, userSecret } = response.data;
      
      return {
        userId: returnedUserId,
        userSecret,
      };
    } catch (error: unknown) {
      console.error('❌ Error registrando usuario en SnapTrade:', error);
      
      const errorMessage = (error as ApiError)?.response?.data?.message || (error as Error)?.message || 'Error desconocido';
      const errorDetails = (error as ApiError)?.response?.data || {};
      
      throw new SnapTradeError(
        (error as ApiError)?.response?.status || 500,
        errorMessage,
        errorDetails
      );
    }
  },

  // Generar URL de conexión del portal
  connectPortalUrl: async (params: {
    userId: string;
    userSecret: string;
    broker?: string;
    immediateRedirect?: boolean;
    customRedirect?: string;
  }) => {
    console.log('🔄 Generando URL de conexión del portal');
    console.log('📋 Parámetros:', params);
    
    try {
      console.log('🔄 Obteniendo cliente de SnapTrade...');
      const client = getSnapTradeClient();
      console.log('✅ Cliente obtenido exitosamente');
      
      console.log('🔄 Llamando a client.authentication.loginSnapTradeUser...');
      const response = await client.authentication.loginSnapTradeUser(params);
      console.log('✅ Respuesta recibida de SnapTrade');
      
      console.log('✅ URL de conexión generada exitosamente');
      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response.data:', JSON.stringify(response.data, null, 2));
      console.log('🔍 Tipo de response.data:', typeof response.data);
      
      // La API de SnapTrade puede devolver un objeto con la URL o directamente la URL
      let redirectUri: string;
      
      // Si response.data es un objeto, buscar la URL dentro
      if (typeof response.data === 'object' && response.data !== null) {
        const data = response.data as PortalResponseData;
        // Intentar diferentes propiedades comunes
        redirectUri = data.redirectURI || 
                     data.redirect_uri || 
                     data.url || 
                     data.link ||
                     String(response.data);
      } else {
        redirectUri = String(response.data);
      }
      
      console.log('🔍 redirectUri final:', redirectUri);
      console.log('🔍 Tipo de redirectUri final:', typeof redirectUri);
      
      return {
        redirectUri: redirectUri,
      };
    } catch (error: unknown) {
      console.error('❌ Error generando URL de conexión:', error);
      console.error('❌ Error message:', error instanceof Error ? error.message : 'Error desconocido');
      console.error('❌ Error response status:', (error as ApiError)?.response?.status);
      console.error('❌ Error response data:', (error as ApiError)?.response?.data);
      
      const errorMessage = (error as ApiError)?.response?.data?.message || (error as Error)?.message || 'Error desconocido';
      const errorDetails = (error as ApiError)?.response?.data || {};
      
      throw new SnapTradeError(
        (error as ApiError)?.response?.status || 500,
        errorMessage,
        errorDetails
      );
    }
  },

  // Listar cuentas del usuario
  listAccounts: async (userId: string, userSecret: string) => {
    const client = getSnapTradeClient();
    console.log('🔄 Listando cuentas del usuario:', userId);
    
    try {
      const response = await client.accountInformation.listUserAccounts({
        userId,
        userSecret,
      });
      
      console.log('✅ Cuentas listadas exitosamente');
      return {
        accounts: response.data
      };
    } catch (error: unknown) {
      console.error('❌ Error listando cuentas:', error);
      
      const errorMessage = (error as ApiError)?.response?.data?.message || (error as Error)?.message || 'Error desconocido';
      const errorDetails = (error as ApiError)?.response?.data || {};
      
      throw new SnapTradeError(
        (error as ApiError)?.response?.status || 500,
        errorMessage,
        errorDetails
      );
    }
  },

  // Listar holdings de una cuenta
  listAccountHoldings: async (accountId: string, userId: string, userSecret: string) => {
    const client = getSnapTradeClient();
    console.log('🔄 Listando holdings de la cuenta:', accountId);
    
    try {
      const response = await client.accountInformation.getUserHoldings({
        accountId,
        userId,
        userSecret,
      });
      
      console.log('✅ Holdings listados exitosamente');
      return {
        holdings: response.data
      };
    } catch (error: unknown) {
      console.error('❌ Error listando holdings:', error);
      
      const errorMessage = (error as ApiError)?.response?.data?.message || (error as Error)?.message || 'Error desconocido';
      const errorDetails = (error as ApiError)?.response?.data || {};
      
      throw new SnapTradeError(
        (error as ApiError)?.response?.status || 500,
        errorMessage,
        errorDetails
      );
    }
  },

  // Listar usuarios registrados
  listUsers: async () => {
    const client = getSnapTradeClient();
    console.log('🔄 Listando usuarios registrados');
    
    try {
      const response = await client.authentication.listSnapTradeUsers();
      
      console.log('✅ Usuarios listados exitosamente');
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Error listando usuarios:', error);
      
      const errorMessage = (error as ApiError)?.response?.data?.message || (error as Error)?.message || 'Error desconocido';
      const errorDetails = (error as ApiError)?.response?.data || {};
      
      throw new SnapTradeError(
        (error as ApiError)?.response?.status || 500,
        errorMessage,
        errorDetails
      );
    }
  },

  // Eliminar usuario
  deleteUser: async (userId: string) => {
    const client = getSnapTradeClient();
    console.log('🔄 Eliminando usuario:', userId);
    
    try {
      const response = await client.authentication.deleteSnapTradeUser({
        userId,
      });
      
      console.log('✅ Usuario eliminado exitosamente');
      return {
        message: "Usuario eliminado correctamente",
        data: response.data
      };
    } catch (error: unknown) {
      console.error('❌ Error eliminando usuario:', error);
      
      const errorMessage = (error as ApiError)?.response?.data?.message || (error as Error)?.message || 'Error desconocido';
      const errorDetails = (error as ApiError)?.response?.data || {};
      
      throw new SnapTradeError(
        (error as ApiError)?.response?.status || 500,
        errorMessage,
        errorDetails
      );
    }
  }
};