'use client';

import { z } from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useLogin } from './use-login';
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

const formSchema = z.object({
  email: z.string().nonempty('Please enter your email').email(),
  password: z.string().nonempty('Please enter your password'),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const login = useLogin();
  const [serverError, setServerError] = useState('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setServerError('');

    await login(data).catch((error) => {
      console.error(error);
      setServerError(error.message);
    });
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-medium tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account</p>
      </div>

      {serverError && (
        <div className="p-4 text-center border rounded-md text-white bg-red-500 border-red-500 ">
          {serverError}
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

          <Button
            type="submit"
            loading={form.formState.isSubmitting}
            // override default spinner color for light theme
            spinner={{ className: 'border-white border-b-primary' }}
          >
            Sign In
          </Button>
        </form>
      </Form>

      <div className="space-y-2 text-center">
        <div className="mx-auto">
          <span>Dont&apos;t have an account?</span>{' '}
          <Link href="/signup" className="hover:underline underline-offset-4 text-blue-500">
            Sign up
          </Link>
        </div>
        <div className="mx-auto">
          <span>Forgot your password?</span>{' '}
          <Link
            href="/forgot-password"
            className="hover:underline underline-offset-4 text-blue-500"
          >
            Reset
          </Link>
        </div>
      </div>
    </div>
  );
}
