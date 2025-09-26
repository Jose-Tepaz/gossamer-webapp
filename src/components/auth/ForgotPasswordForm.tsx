'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const { forgotPassword, loading, error } = useAuth();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    const result = await forgotPassword(data.email);
    
    if (result.success) {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Success Message */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Email sent!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We&apos;ve sent a password reset link to your email address.
            </p>
          </div>

          {/* Success Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Please check your email for the reset code to reset your password.
                </p>
                <p className="text-xs text-gray-500">
                  Didn&apos;t receive the email? Check your spam folder or try again.
                </p>
                
                <div className="space-y-2">
                  <Link href="/reset-password">
                    <Button className="w-full">
                      Enter reset code
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setEmailSent(false)}
                  >
                    Try another email
                  </Button>
                  
                  <Link href="/login">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to login
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <span className="font-bold text-2xl">Gossamer</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Forgot Password Form */}
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              We&apos;ll send you a secure link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="text-sm text-red-600">{error}</div>
                  </div>
                )}

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email address"
                            className="pl-10"
                            disabled={loading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            </Form>

            <Separator className="my-6" />

            {/* Back to Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our{' '}
            <Link href="/support" className="text-blue-600 hover:text-blue-500">
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
