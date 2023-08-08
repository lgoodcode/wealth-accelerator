'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { resetUserPasswordSchema, type ResetUserPasswordFormType } from '@/lib/user-schema';
import { useResetPassword } from './use-reset-password';

type ServerMessage = {
  type: 'error' | 'success';
  message: string;
} | null;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ResetPasswordForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const resetPassword = useResetPassword();
  const [serverMessage, setServerMessage] = useState<ServerMessage>(null);
  const form = useForm<ResetUserPasswordFormType>({
    resolver: zodResolver(resetUserPasswordSchema),
  });

  if (!window.location.hash || !window.location.hash.startsWith('#access_token')) {
    router.replace('/login');
  }

  const onSubmit = async (data: ResetUserPasswordFormType) => {
    setServerMessage(null);

    await resetPassword(data.password)
      .then(() => {
        router.push('/login');
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
        <h1 className="text-2xl font-medium tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground">Enter your new password</p>
      </div>

      {serverMessage && (
        <div
          className={cn('p-4 text-center text-white border rounded-md', {
            'bg-red-500 border-red-500 ': serverMessage.type === 'error',
            'bg-green-500  border-green-500 ': serverMessage.type === 'success',
          })}
        >
          {serverMessage.message}
        </div>
      )}

      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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

          <Button
            type="submit"
            loading={form.formState.isSubmitting}
            // override default spinner color for light theme
            spinner={{ className: 'border-white border-b-primary' }}
          >
            Reset password
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
