'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react'; // Import signIn from next-auth/react

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useToast } from '@/hooks/use-toast'; // Keep useToast for notifications
import { LoginFormValues, loginSchema } from '@/schemas/auth/loginForm.schema'; // Keep schema and types

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | undefined>(undefined); // State to manage login error message

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoginError(undefined); // Clear any previous login errors
    const result = await signIn('credentials', {
      // Use signIn('credentials', ...)
      email: values.email,
      password: values.password,
      redirect: false, // Prevent default redirect, handle it manually
    });

    if (result?.error) {
      // Handle sign-in error
      if (result.error === 'CredentialsSignin') {
        // CredentialsSignin error likely means invalid email/password from authorize function
        setLoginError('Invalid email or password.');
      } else {
        // Other errors from signIn (network, etc.)
        setLoginError('Could not sign in. Please try again.');
        console.error('Sign-in error:', result.error); // Log the error for debugging
      }
      return;
    }

    toast({
      title: 'Login Successful',
      description: 'Welcome back!',
    });
    router.push('/contacts'); // Redirect on successful login
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {loginError && ( // Display login error message if it exists
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{loginError}</div>
            </div>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
