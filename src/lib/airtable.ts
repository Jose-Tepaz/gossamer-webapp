// Airtable configuration and utilities
import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID || '');

// Table references
export const tables = {
  users: base('Users'),
  investmentModels: base('Investment_Models'),
  portfolios: base('Portfolios'),
  transactions: base('Transactions'),
  userSettings: base('User_Settings'),
};

// Types for Airtable records
export interface AirtableUser {
  id: string;                           // Airtable record ID
  memberstack_id: string;               // Memberstack user ID (PRIMARY KEY)
  email: string;                        // Email único
  first_name?: string;                  // Nombre
  last_name?: string;                   // Apellido
  plan_type?: 'Free' | 'Pro' | 'Premium';  // Plan de suscripción
  created_at: string;                   // Fecha de creación
  updated_at: string;                   // Fecha de actualización
  snaptrade_user_id?: string;           // SnapTrade user ID
  is_broker_connected: boolean;         // Estado de conexión con broker
  
  // Campos adicionales para autenticación y seguimiento
  last_login?: string;                  // Última vez que hizo login
  login_count?: number;                 // Número de veces que ha hecho login
  is_active?: boolean;                  // Usuario activo/inactivo
  timezone?: string;                    // Zona horaria del usuario
  preferred_language?: string;          // Idioma preferido
  avatar_url?: string;                  // URL de foto de perfil
  phone?: string;                       // Teléfono (opcional)
  country?: string;                     // País
  
  // Campos de estado y control
  email_verified?: boolean;             // Email verificado
  onboarding_completed?: boolean;       // Onboarding completado
  terms_accepted_at?: string;           // Fecha aceptación términos
  privacy_accepted_at?: string;         // Fecha aceptación privacidad
  
  // Campos para seguridad
  failed_login_attempts?: number;       // Intentos fallidos de login
  account_locked?: boolean;             // Cuenta bloqueada
  last_password_change?: string;        // Último cambio de contraseña
  
  // Campos de integración
  google_id?: string;                   // ID de Google (si usa OAuth)
  apple_id?: string;                    // ID de Apple (si usa OAuth)
  
  // Campos de métricas
  total_portfolio_value?: number;       // Valor total del portafolio
  total_transactions?: number;          // Número total de transacciones
  last_portfolio_sync?: string;         // Última sincronización
}

export interface InvestmentModel {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  allocations: Array<{ symbol: string; percentage: number }>;
  total_percentage: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Portfolio {
  id: string;
  user_id: string;
  broker_name: string;
  account_id: string;
  account_type: string;
  total_value: number;
  last_sync: string;
  positions: Array<{
    symbol: string;
    quantity: number;
    price: number;
    value: number;
  }>;
  created_at: string;
  updated_at: string;
}

// Utility functions
export const createUser = async (userData: Omit<AirtableUser, 'id'>): Promise<string | null> => {
  try {
    const records = await tables.users.create([
      {
        fields: userData,
      },
    ]);
    return records[0].id;
  } catch (error) {
    console.error('Error creating user in Airtable:', error);
    return null;
  }
};

export const getUserByMemberstackId = async (memberstackId: string): Promise<AirtableUser | null> => {
  try {
    const records = await tables.users
      .select({
        filterByFormula: `{memberstack_id} = "${memberstackId}"`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length > 0) {
      const user = {
        id: records[0].id,
        ...records[0].fields,
      } as AirtableUser;
      
      // Actualizar datos de login
      await updateUserLoginData(user.id);
      
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user from Airtable:', error);
    return null;
  }
};

export const updateUser = async (
  userId: string,
  userData: Partial<AirtableUser>
): Promise<boolean> => {
  try {
    await tables.users.update(userId, userData);
    return true;
  } catch (error) {
    console.error('Error updating user in Airtable:', error);
    return false;
  }
};

export const getUserInvestmentModels = async (userId: string): Promise<InvestmentModel[]> => {
  try {
    const records = await tables.investmentModels
      .select({
        filterByFormula: `{user_id} = "${userId}"`,
        sort: [{ field: 'created_at', direction: 'desc' }],
      })
      .all();

    return records.map(record => ({
      id: record.id,
      ...record.fields,
    })) as InvestmentModel[];
  } catch (error) {
    console.error('Error fetching investment models:', error);
    return [];
  }
};

// Nueva función para actualizar datos de login
export const updateUserLoginData = async (userId: string): Promise<void> => {
  try {
    const currentUser = await tables.users.find(userId);
    const currentLoginCount = (currentUser.fields.login_count as number) || 0;
    
    await tables.users.update(userId, {
      last_login: new Date().toISOString(),
      login_count: currentLoginCount + 1,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating login data:', error);
  }
};

// Función para obtener usuario completo con todas sus relaciones
export const getUserWithRelations = async (memberstackId: string) => {
  try {
    const user = await getUserByMemberstackId(memberstackId);
    if (!user) return null;
    
    // Obtener todos los datos relacionados en paralelo
    const [investmentModels, portfolios, transactions, settings] = await Promise.all([
      getUserInvestmentModels(user.id),
      getUserPortfolios(user.id),
      getUserTransactions(user.id),
      getUserSettings(user.id),
    ]);
    
    return {
      user,
      investmentModels,
      portfolios,
      transactions,
      settings,
    };
  } catch (error) {
    console.error('Error fetching user with relations:', error);
    return null;
  }
};

// Función para obtener portafolios del usuario
export const getUserPortfolios = async (userId: string): Promise<Portfolio[]> => {
  try {
    const records = await tables.portfolios
      .select({
        filterByFormula: `{user_id} = "${userId}"`,
        sort: [{ field: 'created_at', direction: 'desc' }],
      })
      .all();

    return records.map(record => ({
      id: record.id,
      ...record.fields,
    })) as Portfolio[];
  } catch (error) {
    console.error('Error fetching user portfolios:', error);
    return [];
  }
};

// Función para obtener transacciones del usuario
export const getUserTransactions = async (userId: string, limit: number = 50) => {
  try {
    const records = await tables.transactions
      .select({
        filterByFormula: `{user_id} = "${userId}"`,
        sort: [{ field: 'transaction_date', direction: 'desc' }],
        maxRecords: limit,
      })
      .all();

    return records.map(record => ({
      id: record.id,
      ...record.fields,
    }));
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return [];
  }
};

// Función para obtener configuraciones del usuario
export const getUserSettings = async (userId: string) => {
  try {
    const records = await tables.userSettings
      .select({
        filterByFormula: `{user_id} = "${userId}"`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length > 0) {
      return {
        id: records[0].id,
        ...records[0].fields,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return null;
  }
}; 