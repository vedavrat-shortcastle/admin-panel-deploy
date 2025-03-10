'use client';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { type LoginFormValues } from '@/schemas/auth/loginForm.schema';
import OtpFormComponent from '@/components/auth/OtpFormComponent';
import LoginFormComponent from '@/components/auth/LoginFormComponent';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [credentials, setCredentials] = useState<LoginFormValues | null>(null);

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {showOtpScreen ? 'Enter Verification Code' : 'Sign in'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showOtpScreen ? (
            <OtpFormComponent
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setShowOtpScreen={setShowOtpScreen}
              email={credentials?.email}
              credentials={credentials}
              setCredentials={setCredentials}
            />
          ) : (
            <LoginFormComponent
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setShowOtpScreen={setShowOtpScreen}
              setCredentials={setCredentials}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
