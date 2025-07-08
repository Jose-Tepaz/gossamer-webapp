'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  getUserInvestmentModels,
  tables,
  type InvestmentModel,
  type Portfolio 
} from '@/lib/airtable';

export const useAirtable = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Investment Models
  const [investmentModels, setInvestmentModels] = useState<InvestmentModel[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  // Fetch user's investment models
  const fetchInvestmentModels = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const models = await getUserInvestmentModels(user.id);
      setInvestmentModels(models);
    } catch (err) {
      setError('Error fetching investment models');
      console.error('Error fetching investment models:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new investment model
  const createInvestmentModel = async (modelData: {
    name: string;
    description?: string;
    allocations: Array<{ symbol: string; percentage: number }>;
  }) => {
    if (!user?.id) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const totalPercentage = modelData.allocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
      
      const records = await tables.investmentModels.create([
        {
          fields: {
            user_id: user.id,
            name: modelData.name,
            description: modelData.description || '',
            allocations: JSON.stringify(modelData.allocations),
            total_percentage: totalPercentage,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
          },
        },
      ]);
      
      const newModel = {
        id: records[0].id,
        ...records[0].fields,
      } as InvestmentModel;
      
      setInvestmentModels(prev => [newModel, ...prev]);
      return newModel;
    } catch (err) {
      setError('Error creating investment model');
      console.error('Error creating investment model:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update investment model
  const updateInvestmentModel = async (
    modelId: string, 
    updates: Partial<Omit<InvestmentModel, 'allocations'>> & { allocations?: Array<{ symbol: string; percentage: number }> }
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      // Convert allocations to string if provided
      if (updates.allocations) {
        updateData.allocations = JSON.stringify(updates.allocations);
      }
      
      await tables.investmentModels.update(modelId, updateData);
      
      setInvestmentModels(prev => 
        prev.map(model => 
          model.id === modelId ? { ...model, ...updates } : model
        )
      );
      
      return true;
    } catch (err) {
      setError('Error updating investment model');
      console.error('Error updating investment model:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete investment model
  const deleteInvestmentModel = async (modelId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await tables.investmentModels.destroy(modelId);
      setInvestmentModels(prev => prev.filter(model => model.id !== modelId));
      return true;
    } catch (err) {
      setError('Error deleting investment model');
      console.error('Error deleting investment model:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's portfolios
  const fetchPortfolios = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const records = await tables.portfolios
        .select({
          filterByFormula: `{user_id} = "${user.id}"`,
          sort: [{ field: 'created_at', direction: 'desc' }],
        })
        .all();

      const portfolioData = records.map(record => ({
        id: record.id,
        ...record.fields,
      })) as Portfolio[];
      
      setPortfolios(portfolioData);
    } catch (err) {
      setError('Error fetching portfolios');
      console.error('Error fetching portfolios:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create transaction
  const createTransaction = async (transactionData: {
    portfolio_id: string;
    type: 'Buy' | 'Sell' | 'Dividend';
    symbol: string;
    quantity: number;
    price: number;
    transaction_date: string;
  }) => {
    if (!user?.id) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const totalAmount = transactionData.quantity * transactionData.price;
      
      const records = await tables.transactions.create([
        {
          fields: {
            user_id: user.id,
            portfolio_id: transactionData.portfolio_id,
            type: transactionData.type,
            symbol: transactionData.symbol,
            quantity: transactionData.quantity,
            price: transactionData.price,
            total_amount: totalAmount,
            transaction_date: transactionData.transaction_date,
            created_at: new Date().toISOString(),
          },
        },
      ]);
      
      return {
        id: records[0].id,
        ...records[0].fields,
      };
    } catch (err) {
      setError('Error creating transaction');
      console.error('Error creating transaction:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update user settings
  const updateUserSettings = async (settings: {
    notifications_enabled?: boolean;
    email_alerts?: boolean;
    default_currency?: string;
    risk_tolerance?: 'Conservative' | 'Moderate' | 'Aggressive';
  }) => {
    if (!user?.id) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      // First, try to find existing settings
      const existingRecords = await tables.userSettings
        .select({
          filterByFormula: `{user_id} = "${user.id}"`,
          maxRecords: 1,
        })
        .firstPage();

      if (existingRecords.length > 0) {
        // Update existing settings
        await tables.userSettings.update(existingRecords[0].id, {
          ...settings,
          updated_at: new Date().toISOString(),
        });
      } else {
        // Create new settings
        await tables.userSettings.create([
          {
            fields: {
              user_id: user.id,
              ...settings,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
        ]);
      }
      
      return true;
    } catch (err) {
      setError('Error updating user settings');
      console.error('Error updating user settings:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch data when user changes
  useEffect(() => {
    if (user?.id) {
      fetchInvestmentModels();
      fetchPortfolios();
    }
  }, [user?.id]);

  return {
    // State
    loading,
    error,
    investmentModels,
    portfolios,
    
    // Investment Models
    fetchInvestmentModels,
    createInvestmentModel,
    updateInvestmentModel,
    deleteInvestmentModel,
    
    // Portfolios
    fetchPortfolios,
    
    // Transactions
    createTransaction,
    
    // User Settings
    updateUserSettings,
  };
}; 