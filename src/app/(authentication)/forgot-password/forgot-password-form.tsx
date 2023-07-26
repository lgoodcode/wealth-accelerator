'use client';

import Link from 'next/link';
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
import {
  sendResetPasswordEmailSchema,
  type SendResetPasswordEmailFormType,
} from '@/lib/user-schema';
import { usePasswordResetEmail } from './use-password-reset-email';

type ServerMessage = {
  type: 'error' | 'success';
  message: string;
} | null;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ForgotPasswordForm({ className, ...props }: UserAuthFormProps) {
  const passwordResetEmail = usePasswordResetEmail();
  const [serverMessage, setServerMessage] = useState<ServerMessage>(null);
  const form = useForm<SendResetPasswordEmailFormType>({
    resolver: zodResolver(sendResetPasswordEmailSchema),
  });

  const onSubmit = async (data: SendResetPasswordEmailFormType) => {
    setServerMessage(null);

    await passwordResetEmail(data.email)
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

          <Button
            type="submit"
            loading={form.formState.isSubmitting}
            // override default spinner color for light theme
            spinner={{ className: 'border-white border-b-primary' }}
          >
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
