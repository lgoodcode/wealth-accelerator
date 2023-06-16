'use client';

import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { clsx } from 'clsx';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { supabase } from '@/lib/supabase/client';
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
  name: z
    .string()
    .min(2, 'Your name must contain at least 2 characters')
    .max(50, 'Name is too long'),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(50, 'Password is too long')
    .refine((value) => /[a-z]+/.test(value), {
      message: 'Password must contain at least one lowercase letter',
    })
    .refine((value) => /[A-Z]+/.test(value), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine((value) => /[0-9]+/.test(value), {
      message: 'Password must contain at least one number',
    })
    .refine((value) => /[!@#$%&'*+/=?^_`{|}~-]+/.test(value), {
      message: 'Password must contain at least one special character',
    }),
});

type ServerMessage = {
  type: 'error' | 'success';
  message: string;
} | null;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegisterForm({ className, ...props }: UserAuthFormProps) {
  const [serverMessage, setServerMessage] = useState<ServerMessage>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setServerMessage(null);

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setServerMessage({
        type: 'error',
        message: error.message,
      });
    } else {
      setServerMessage({
        type: 'success',
        message: 'Check your email for the confirmation link',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className={clsx('grid gap-6', className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-medium tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your name, email, and password below to create your account
        </p>
      </div>

      {serverMessage && (
        <div
          className={clsx('p-4 text-center text-white border rounded-md', {
            'bg-red-500 border-red-500 ': serverMessage.type === 'error',
            'bg-green-500  border-green-500 ': serverMessage.type === 'success',
          })}
        >
          {serverMessage.message}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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

          <Button type="submit" loading={isLoading} disabled={isLoading}>
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
