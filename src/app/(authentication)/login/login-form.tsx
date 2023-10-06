'use client';

import Link from 'next/link';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils/cn';
import { loginFormSchema, type LoginForm } from '@/lib/user-schema';
import { useLogin } from '@/hooks/auth/use-login';
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

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const login = useLogin();
  const [serverError, setServerError] = useState('');
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError('');

    await login(data).catch((error) => {
      console.error(error);
      setServerError(error.message);
    });
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-medium tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account</p>
      </div>

      {serverError && (
        <Alert variant="destructive">
          <AlertTitle>{serverError}</AlertTitle>
        </Alert>
      )}

      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
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
            Sign In
          </Button>
        </form>
      </Form>

      <div className="space-y-2 text-center">
        {/* <div className="mx-auto">
          <span>Dont&apos;t have an account?</span>{' '}
          <Link href="/signup" className="hover:underline underline-offset-4 text-blue-500">
            Sign up
          </Link>
        </div> */}
        <div className="mx-auto">
          <Link href="/forgot-password" className="link">
            Forgot your password?
          </Link>
        </div>
      </div>

      <div className="px-10 text-center text-sm text-muted-foreground">
        <p className="leading-normal">
          By using our website, you agree to our{' '}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary whitespace-nowrap"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
