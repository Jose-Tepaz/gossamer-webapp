// SnapTrade types
export interface SnapTradeUser {
  userId: string;
  userToken: string;
}

export interface Brokerage {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  maintenance: boolean;
  isSupported: boolean;
  exchangeRateMultiplier?: number;
}

export interface BrokerageAuthorization {
  id: string;
  brokerage: Brokerage;
  name: string;
  type: string;
  isDisabled: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface Account {
  id: string;
  brokerageAuthorization: BrokerageAuthorization;
  name: string;
  number: string;
  institutionName: string;
  type: AccountType;
  balance: Balance;
  meta: AccountMeta;
  portfolioGroup: string;
  createdDate: string;
  updatedDate: string;
}

export interface AccountType {
  id: string;
  type: string;
  description: string;
}

export interface Balance {
  total: MoneyValue;
  buyingPower: MoneyValue;
  cashRestrictions: MoneyValue[];
}

export interface MoneyValue {
  amount: number;
  currency: Currency;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
}

export interface AccountMeta {
  [key: string]: unknown;
}

export interface Position {
  symbol: UniversalSymbol;
  instrument: Instrument;
  account: Account;
  averagePrice: number;
  quantity: number;
  openQuantity: number;
  fractionalUnits: number;
  notionalValue: MoneyValue;
  timeInForce: string;
  price: MoneyValue;
}

export interface UniversalSymbol {
  id: string;
  symbol: string;
  rawSymbol: string;
  description: string;
  currency: Currency;
  exchange: Exchange;
  type: SecurityType;
  figi: string;
  figiInstrument: string;
}

export interface Exchange {
  id: string;
  code: string;
  micCode: string;
  name: string;
  timezone: string;
  startTime: string;
  endTime: string;
  suffix: string;
}

export interface SecurityType {
  id: string;
  code: string;
  description: string;
  isSupported: boolean;
}

export interface Instrument {
  id: string;
  symbol: UniversalSymbol;
  name: string;
  type: SecurityType;
  exchange: Exchange;
}

export interface Transaction {
  id: string;
  account: Account;
  amount: MoneyValue;
  currency: Currency;
  description: string;
  fees: MoneyValue;
  fxRate: number;
  institution: string;
  optionType: string;
  price: MoneyValue;
  settlementDate: string;
  symbol: UniversalSymbol;
  tradeDate: string;
  type: string;
  units: number;
}

export interface PortfolioGroup {
  id: string;
  name: string;
  type: string;
}

export interface Performance {
  totalEquity: MoneyValue;
  totalReturn: MoneyValue;
  totalReturnPercent: number;
  totalGainLoss: MoneyValue;
  totalGainLossPercent: number;
  timeWeightedReturn: MoneyValue;
  timeWeightedReturnPercent: number;
  freeCashFlow: MoneyValue;
  netContributions: MoneyValue;
  netDeposits: MoneyValue;
  fees: MoneyValue;
  rateOfReturn: number;
  returnOfCapital: MoneyValue;
  returnOfCapitalPercent: number;
}

// API Response types
export interface SnapTradeResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  connectionDate?: string;
  lastSyncDate?: string;
  accounts: Account[];
}

export interface BrokerageConnectionRequest {
  brokerage: string;
  immediateRedirect?: boolean;
  customRedirect?: string;
  reconnect?: string;
  connectionType?: string;
} 