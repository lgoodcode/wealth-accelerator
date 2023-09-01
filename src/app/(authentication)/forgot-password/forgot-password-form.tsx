'use client';

import Link from 'next/link';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils/cn';
import {
  sendResetPasswordEmailSchema,
  type SendResetPasswordEmailFormType,
} from '@/lib/user-schema';
import { useForgotPassword } from '@/hooks/auth/use-forgot-password';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
type ServerMessage = {
  type: 'error' | 'success';
  message: string;
} | null;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ForgotPasswordForm({ className, ...props }: UserAuthFormProps) {
  const sendPasswordResetEmail = useForgotPassword();
  const [serverMessage, setServerMessage] = useState<ServerMessage>(null);
  const form = useForm<SendResetPasswordEmailFormType>({
    resolver: zodResolver(sendResetPasswordEmailSchema),
  });

  const onSubmit = async (data: SendResetPasswordEmailFormType) => {
    setServerMessage(null);

    await sendPasswordResetEmail(data.email)
      .then(() => {
        setServerMessage({
          type: 'success',
          message: 'Check your email for the password reset link',
        });
      })
      .catch((error) => {
        console.error(error);
        setServerMessage({
          type: 'error',
          message: error.message,
        });
      });
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-medium tracking-tight">Forgot your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and a password reset link will be sent to you
        </p>
      </div>

      {serverMessage && (
        <Alert variant={serverMessage.type === 'error' ? 'destructive' : 'success'}>
          <AlertTitle>{serverMessage.message}</AlertTitle>
        </Alert>
      )}

      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" loading={form.formState.isSubmitting}>
            Send email
          </Button>
        </form>
      </Form>

      <div className="mx-auto">
        <span>Already have an account?</span>{' '}
        <Link href="/login" className="link">
          Sign In
        </Link>
      </div>
    </div>
  );
}
