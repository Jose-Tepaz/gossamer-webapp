'use client';

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  user?: {
    firstName?: string;
    lastName?: string;
    email: string;
    planType: 'Free' | 'Pro' | 'Premium';
  };
  showFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  user, 
  showFooter = true 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        user={user}
        onMenuToggle={handleMenuToggle}
        isMenuOpen={isMobileMenuOpen}
      />
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout; 