// Authentication types for Memberstack integration
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  planType?: 'Free' | 'Pro' | 'Premium';
  createdAt?: string;
  updatedAt?: string;
  // Optional Memberstack specific fields
  memberstackId?: string;
  verified?: boolean;
  permissions?: string[];
  // Optional SnapTrade fields (for future use)
  snaptradeUserId?: string;
  snaptradeUserToken?: string;
  isBrokerConnected?: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
}

// Plan types
export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
  stripePriceId?: string;
}

export interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

// Memberstack specific types
export interface MemberstackMember {
  id: string;
  auth: {
    email: string;
    hasPassword: boolean;
    providers: any[];
  };
  customFields: {
    [key: string]: any;
    'first-name'?: string;
    'last-name'?: string;
  };
  planConnections: Array<{
    planId: string;
    status: string;
  }>;
  createdAt: string;
  lastLogin?: string;
  verified: boolean;
  permissions: string[];
}

export interface MemberstackResponse {
  data: {
    member: MemberstackMember;
  };
  tokens: {
    accessToken: string;
    expires: number;
    type: string;
  };
} 