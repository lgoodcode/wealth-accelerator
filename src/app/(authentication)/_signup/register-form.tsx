'use client';

import Link from 'next/link';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { captureException } from '@sentry/nextjs';

import { cn } from '@/lib/utils/cn';
import { useSignUp } from '@/hooks/auth/use-signup';
import { registerUserFormSchema, type RegisterUserForm } from '@/lib/user-schema';
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

export function RegisterForm({ className, ...props }: UserAuthFormProps) {
  const signUp = useSignUp();
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(null);
  const form = useForm<RegisterUserForm>({
    resolver: zodResolver(registerUserFormSchema),
  });

  const onSubmit = async (data: RegisterUserForm) => {
    setServerMessage(null);

    await signUp(data)
      .then(() => {
        setServerMessage({
          type: 'success',
          message: 'Check your email for the confirmation link',
        });
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        setServerMessage({
          type: 'error',
          message: error.message,
        });
      });
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-medium tracking-tight">Create an account</h1>
        <p className="md:px-8 text-sm text-muted-foreground">
          Enter your name, email, and password below to create your account
        </p>
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            Sign Up
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
