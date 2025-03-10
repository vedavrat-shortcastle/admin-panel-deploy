import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';

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

import { LoginFormValues, loginSchema } from '@/schemas/auth/loginForm.schema';
import { useRouter } from 'next/navigation';

interface LoginFormComponentProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setShowOtpScreen: (show: boolean) => void;
  setCredentials: (credentials: LoginFormValues | null) => void;
}

export default function LoginFormComponent({
  isLoading,
  setIsLoading,
  setShowOtpScreen,
  setCredentials,
}: LoginFormComponentProps) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        otp: undefined,
        redirect: false,
      });

      if (result?.error) {
        const error = JSON.parse(result.error);
        if (error.type === 'otp' && error.message === 'OTP sent') {
          setShowOtpScreen(true);
          setCredentials(values);
        } else {
          loginForm.setError(error.type, {
            type: 'manual',
            message: error.message,
          });
        }
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(onLoginSubmit)}
        className="space-y-4"
      >
        <FormField
          control={loginForm.control}
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
          control={loginForm.control}
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
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
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

        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </Form>
  );
}
