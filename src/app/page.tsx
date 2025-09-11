'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Aquí verificaremos si el usuario está autenticado
    // Por ahora, redirigimos al login después de 2 segundos
    const timer = setTimeout(() => {
      router.push('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">FinanceApp</CardTitle>
          <CardDescription>
            Portfolio Management Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-gray-600">Loading application...</span>
          </div>
          
          <div className="pt-4 space-y-2">
            <Link href="/login" className="block">
              <Button className="w-full">
                Go to Login
              </Button>
            </Link>
            <Link href="/dashboard" className="block">
              <Button variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/snaptrade" className="block">
              <Button variant="outline" className="w-full">
                SnapTrade Integration
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
