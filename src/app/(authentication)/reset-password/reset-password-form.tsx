'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils/cn';
import { resetUserPasswordSchema, type ResetUserPasswordForm } from '@/lib/user-schema';
import { useResetPassword } from '@/hooks/auth/use-reset-password';
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
import type { ServerMessage } from '@/lib/types/public';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ResetPasswordForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const resetPassword = useResetPassword();
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(null);
  const form = useForm<ResetUserPasswordForm>({
    resolver: zodResolver(resetUserPasswordSchema),
  });

  const onSubmit = async (data: ResetUserPasswordForm) => {
    setServerMessage(null);

    await resetPassword(data.password)
      .then(() => {
        router.push('/login');
      })
      .catch((error) => {
        console.error(error);
        setServerMessage({
          type: 'error',
          message: 'An error has occurred. Please try sending a new password reset email.',
        });
      });
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-medium tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground">Enter your new password</p>
      </div>

      {serverMessage && (
        <Alert variant={serverMessage.type === 'error' ? 'destructive' : 'success'}>
          <AlertTitle>{serverMessage.message}</AlertTitle>
        </Alert>
      )}

      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" loading={form.formState.isSubmitting}>
            Reset Password
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
