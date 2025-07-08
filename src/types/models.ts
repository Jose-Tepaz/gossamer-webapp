// Investment models types
export interface InvestmentModel {
  id: string;
  userId: string;
  name: string;
  description?: string;
  allocations: AssetAllocation[];
  totalPercentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Performance metrics
  expectedReturn?: number;
  riskLevel?: RiskLevel;
  timeHorizon?: TimeHorizon;
}

export interface AssetAllocation {
  symbol: string;
  name: string;
  percentage: number;
  assetClass: AssetClass;
  sector?: string;
  currentPrice?: number;
  targetValue?: number;
  currentValue?: number;
  difference?: number;
  differencePercentage?: number;
}

export interface AssetClass {
  id: string;
  name: string;
  description: string;
  riskLevel: RiskLevel;
  expectedReturn: number;
  volatility: number;
}

export interface ModelComparison {
  model: InvestmentModel;
  currentPortfolio: PortfolioSummary;
  differences: AllocationDifference[];
  totalDifference: number;
  rebalancingNeeded: boolean;
  suggestedTrades: SuggestedTrade[];
}

export interface PortfolioSummary {
  totalValue: number;
  currency: string;
  positions: PortfolioPosition[];
  lastUpdated: string;
  performance: PortfolioPerformance;
}

export interface PortfolioPosition {
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
  currentValue: number;
  percentage: number;
  assetClass: AssetClass;
  gainLoss: number;
  gainLossPercentage: number;
}

export interface PortfolioPerformance {
  totalReturn: number;
  totalReturnPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
  weekChange: number;
  weekChangePercentage: number;
  monthChange: number;
  monthChangePercentage: number;
  yearChange: number;
  yearChangePercentage: number;
}

export interface AllocationDifference {
  symbol: string;
  name: string;
  currentPercentage: number;
  targetPercentage: number;
  difference: number;
  differenceValue: number;
  action: 'BUY' | 'SELL' | 'HOLD';
}

export interface SuggestedTrade {
  symbol: string;
  name: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  estimatedPrice: number;
  estimatedValue: number;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ModelTemplate {
  id: string;
  name: string;
  description: string;
  category: ModelCategory;
  riskLevel: RiskLevel;
  timeHorizon: TimeHorizon;
  allocations: AssetAllocation[];
  isPopular: boolean;
  expectedReturn: number;
  volatility: number;
}

export interface ModelBacktest {
  modelId: string;
  startDate: string;
  endDate: string;
  initialValue: number;
  finalValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  performanceData: PerformanceDataPoint[];
}

export interface PerformanceDataPoint {
  date: string;
  value: number;
  return: number;
  cumulativeReturn: number;
}

// Enums
export type RiskLevel = 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' | 'VERY_AGGRESSIVE';

export type TimeHorizon = 'SHORT' | 'MEDIUM' | 'LONG' | 'VERY_LONG';

export type ModelCategory = 
  | 'BALANCED'
  | 'GROWTH'
  | 'INCOME'
  | 'CONSERVATIVE'
  | 'AGGRESSIVE'
  | 'SECTOR_SPECIFIC'
  | 'GEOGRAPHIC'
  | 'ESG'
  | 'CUSTOM';

export type AssetType = 
  | 'STOCK'
  | 'BOND'
  | 'ETF'
  | 'MUTUAL_FUND'
  | 'COMMODITY'
  | 'CRYPTO'
  | 'REAL_ESTATE'
  | 'CASH';

// Form types
export interface CreateModelForm {
  name: string;
  description?: string;
  riskLevel: RiskLevel;
  timeHorizon: TimeHorizon;
  allocations: {
    symbol: string;
    percentage: number;
  }[];
}

export interface EditModelForm extends CreateModelForm {
  id: string;
  isActive: boolean;
}

// State types
export interface ModelsState {
  models: InvestmentModel[];
  currentModel: InvestmentModel | null;
  templates: ModelTemplate[];
  isLoading: boolean;
  error: string | null;
  comparison: ModelComparison | null;
} 