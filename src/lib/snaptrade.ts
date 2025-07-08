// SnapTrade configuration and utilities
import axios from 'axios';

// SnapTrade API configuration
const SNAPTRADE_BASE_URL = 'https://api.snaptrade.com/api/v1';

// Create axios instance with default config
const snaptradeAPI = axios.create({
  baseURL: SNAPTRADE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
snaptradeAPI.interceptors.request.use((config) => {
  config.headers['consumerKey'] = process.env.SNAPTRADE_CONSUMER_KEY;
  config.headers['consumerSecret'] = process.env.SNAPTRADE_CONSUMER_SECRET;
  return config;
});

// Types for SnapTrade
export interface SnapTradeUser {
  userId: string;
  userToken: string;
}

export interface BrokerConnection {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  maintenance: boolean;
  isSupported: boolean;
}

export interface Account {
  id: string;
  brokerName: string;
  name: string;
  type: string;
  balance: {
    total: number;
    currency: string;
  };
  positions: Position[];
}

export interface Position {
  symbol: string;
  quantity: number;
  price: number;
  value: number;
  currency: string;
  lastUpdated: string;
}

// Utility functions
export const createSnapTradeUser = async (userId: string): Promise<SnapTradeUser | null> => {
  try {
    const response = await snaptradeAPI.post('/snapTrade/registerUser', {
      userId,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating SnapTrade user:', error);
    return null;
  }
};

export const getAuthorizationURL = async (
  userId: string,
  userToken: string,
  broker: string
): Promise<string | null> => {
  try {
    const response = await snaptradeAPI.post('/snapTrade/login', {
      userId,
      userToken,
      broker,
    });
    return response.data.redirectURI;
  } catch (error) {
    console.error('Error getting authorization URL:', error);
    return null;
  }
};

export const getUserAccounts = async (
  userId: string,
  userToken: string
): Promise<Account[]> => {
  try {
    const response = await snaptradeAPI.get('/accounts', {
      params: { userId, userToken },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user accounts:', error);
    return [];
  }
};

export const getAccountPositions = async (
  userId: string,
  userToken: string,
  accountId: string
): Promise<Position[]> => {
  try {
    const response = await snaptradeAPI.get(`/accounts/${accountId}/positions`, {
      params: { userId, userToken },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching account positions:', error);
    return [];
  }
};

export const getBrokerConnections = async (): Promise<BrokerConnection[]> => {
  try {
    const response = await snaptradeAPI.get('/brokerages');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching broker connections:', error);
    return [];
  }
};

export const checkAPIStatus = async (): Promise<boolean> => {
  try {
    const response = await snaptradeAPI.get('/status');
    return response.data.status === 'ok';
  } catch (error) {
    console.error('SnapTrade API status check failed:', error);
    return false;
  }
}; 