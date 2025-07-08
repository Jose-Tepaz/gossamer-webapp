'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { 
  TrendingUp,
  LayoutDashboard,
  PieChart,
  Target,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Link2
} from 'lucide-react';

interface SidebarProps {
  user?: {
    firstName?: string;
    lastName?: string;
    email: string;
    planType: 'Free' | 'Pro' | 'Premium';
  };
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  isCollapsed = false, 
  onToggleCollapse 
}) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navigationItems = [
    {
      section: 'Main',
      items: [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/assets', label: 'Portfolio', icon: PieChart },
        { href: '/dashboard/models', label: 'Models', icon: Target },
        { href: '/broker-connection', label: 'Brokers', icon: Link2 },
      ]
    },
    {
      section: 'Account',
      items: [
        { href: '/plans', label: 'Subscription', icon: CreditCard },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      section: 'Support',
      items: [
        { href: '/help', label: 'Help Center', icon: HelpCircle },
      ]
    }
  ];

  const getPlanBadgeColor = (planType: string) => {
    switch (planType) {
      case 'Premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'Pro':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className={`
      ${isCollapsed ? 'w-16' : 'w-64'} 
      h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">FinanceApp</span>
            </Link>
          )}
          
          {isCollapsed && (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          )}
          
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="h-8 w-8"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.email
                  }
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getPlanBadgeColor(user.planType)}`}
                  >
                    {user.planType}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {navigationItems.map((section) => (
            <div key={section.section}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.section}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={`
                          w-full justify-start 
                          ${isCollapsed ? 'px-2' : 'px-3'} 
                          ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}
                        `}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
                        {!isCollapsed && <span>{item.label}</span>}
                      </Button>
                    </Link>
                  );
                })}
              </div>
              {!isCollapsed && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'} text-gray-700 hover:bg-gray-100`}
            title={isCollapsed ? 'Notifications' : undefined}
          >
            <Bell className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span>Notifications</span>}
            {!isCollapsed && (
              <Badge variant="destructive" className="ml-auto text-xs">
                3
              </Badge>
            )}
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'} text-red-600 hover:bg-red-50`}
            title={isCollapsed ? 'Logout' : undefined}
            onClick={() => logout()}
          >
            <LogOut className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 