/**
 * Configuración de la aplicación
 * Centraliza todas las variables de entorno y configuraciones
 */

export const config = {
  // URLs de la aplicación
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000',
  
  // SnapTrade
  snaptrade: {
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/snaptrade` : 'http://localhost:4000/api/snaptrade',
    clientId: process.env.NEXT_PUBLIC_SNAPTRADE_CLIENT_ID,
    consumerKey: process.env.SNAPTRADE_CONSUMER_KEY,
    consumerSecret: process.env.SNAPTRADE_CONSUMER_SECRET,
  },
  
  // Memberstack
  memberstack: {
    publicKey: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY,
    secretKey: process.env.MEMBERSTACK_SECRET_KEY,
  },
  
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  
  // Airtable
  airtable: {
    apiKey: process.env.AIRTABLE_API_KEY,
    baseId: process.env.AIRTABLE_BASE_ID,
  },
  
  // Entorno
  environment: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}

// Validar configuraciones críticas
export const validateConfig = () => {
  const errors: string[] = []
  
  if (!config.snaptrade.baseUrl) {
    errors.push('NEXT_PUBLIC_BACKEND_URL no está configurado')
  }
  
  if (!config.memberstack.publicKey) {
    errors.push('NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY no está configurado')
  }
  
  if (!config.supabase.url || !config.supabase.anonKey) {
    errors.push('Variables de Supabase no están configuradas')
  }
  
  if (errors.length > 0) {
    console.error('❌ Errores de configuración:', errors)
    return false
  }
  
  console.log('✅ Configuración validada correctamente')
  return true
}

// URLs específicas de SnapTrade
export const snaptradeUrls = {
  registerUser: `${config.snaptrade.baseUrl}/register-user`,
  connectPortal: `${config.snaptrade.baseUrl}/connect-portal-url`,
  listAccounts: `${config.snaptrade.baseUrl}/list-accounts`,
  listHoldings: `${config.snaptrade.baseUrl}/list-account-holdings`,
}

// URLs de mock para desarrollo
export const snaptradeMockUrls = {
  registerUser: `${config.baseUrl}/api/snaptrade-mock/register-user`,
  connectPortal: `${config.baseUrl}/api/snaptrade-mock/connect-portal-url`,
  listAccounts: `${config.baseUrl}/api/snaptrade-mock/list-accounts`,
  listHoldings: `${config.baseUrl}/api/snaptrade-mock/list-account-holdings`,
}

// Función para obtener URLs (mock o real)
export const getSnapTradeUrls = (useMock: boolean = false) => {
  return useMock ? snaptradeMockUrls : snaptradeUrls
}

export default config
