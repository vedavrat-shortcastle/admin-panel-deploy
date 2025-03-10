import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import {
  OTPFormValues,
  otpSchema,
  LoginFormValues,
} from '@/schemas/auth/loginForm.schema';
import { useRouter } from 'next/navigation';

interface OtpFormComponentProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setShowOtpScreen: (show: boolean) => void;
  email?: string;
  credentials: LoginFormValues | null;
  setCredentials: (credentials: LoginFormValues | null) => void;
}

export default function OtpFormComponent({
  isLoading,
  setIsLoading,
  setShowOtpScreen,
  credentials,
}: OtpFormComponentProps) {
  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
    mode: 'onChange',
  });
  const router = useRouter();

  const onOtpSubmit = async (values: OTPFormValues) => {
    if (!credentials) return;
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        otp: values.otp,
        redirect: false,
      });

      if (result?.error) {
        const error = JSON.parse(result.error);
        otpForm.setError('otp', {
          type: 'manual',
          message: error.message,
        });
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...otpForm}>
      <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
        <FormField
          control={otpForm.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  containerClassName="gap-2 flex items-center justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setShowOtpScreen(false);
              otpForm.reset();
            }}
          >
            Go Back
          </Button>
        </div>
      </form>
    </Form>
  );
}
