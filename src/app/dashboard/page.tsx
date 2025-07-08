'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Users,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Transform user data to match DashboardLayout expected format
  const dashboardUser = user ? {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    planType: user.planType || 'Free' as const,
  } : undefined;

  // Mock portfolio data
  const portfolioStats = {
    totalValue: 125430.50,
    dayChange: 2340.20,
    dayChangePercent: 1.9,
    connectedAccounts: 2,
    activeModels: 3,
  };

  const recentTransactions = [
    { id: 1, symbol: 'AAPL', type: 'BUY', amount: 1500, date: '2024-01-07' },
    { id: 2, symbol: 'GOOGL', type: 'SELL', amount: 2300, date: '2024-01-06' },
    { id: 3, symbol: 'MSFT', type: 'BUY', amount: 1800, date: '2024-01-05' },
  ];

  const topPositions = [
    { symbol: 'AAPL', name: 'Apple Inc.', value: 25430, percentage: 20.3, change: 2.1 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', value: 18920, percentage: 15.1, change: -0.8 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', value: 15680, percentage: 12.5, change: 1.4 },
    { symbol: 'TSLA', name: 'Tesla Inc.', value: 12340, percentage: 9.8, change: 3.2 },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout 
        user={dashboardUser}
        title="Dashboard"
        subtitle="Here's what's happening with your portfolio today."
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Model
          </Button>
        }
      >
      <div className="p-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolioStats.totalValue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +{portfolioStats.dayChangePercent}% today
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Day Change</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +${portfolioStats.dayChange.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Since market open
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Accounts</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolioStats.connectedAccounts}</div>
              <p className="text-xs text-muted-foreground">
                Brokerage accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Models</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolioStats.activeModels}</div>
              <p className="text-xs text-muted-foreground">
                Investment strategies
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Positions */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Positions</CardTitle>
                  <CardDescription>
                    Your largest holdings by value
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPositions.map((position) => (
                      <div key={position.symbol} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{position.symbol}</span>
                          </div>
                          <div>
                            <p className="font-medium">{position.symbol}</p>
                            <p className="text-sm text-gray-600">{position.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${position.value.toLocaleString()}</p>
                          <div className="flex items-center text-sm">
                            <span className="text-gray-600 mr-2">{position.percentage}%</span>
                            <span className={position.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {position.change >= 0 ? '+' : ''}{position.change}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Latest portfolio activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant={transaction.type === 'BUY' ? 'default' : 'secondary'}>
                            {transaction.type}
                          </Badge>
                          <div>
                            <p className="font-medium">{transaction.symbol}</p>
                            <p className="text-sm text-gray-600">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${transaction.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="positions">
            <Card>
              <CardHeader>
                <CardTitle>All Positions</CardTitle>
                <CardDescription>
                  Complete view of your portfolio holdings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Positions view will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  All your trading activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Transaction history will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models">
            <Card>
              <CardHeader>
                <CardTitle>Investment Models</CardTitle>
                <CardDescription>
                  Your custom allocation strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Investment models will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
} 