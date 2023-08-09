'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AlertCircle, CheckCircle } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { setPasswordSchema, type SetPasswordFormType } from '@/lib/user-schema';
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
import { useSetPassword } from './use-set-password';

type ServerMessage = {
  type: 'error' | 'success';
  message: string;
} | null;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SetPasswordForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const setPassword = useSetPassword();
  const [serverMessage, setServerMessage] = useState<ServerMessage>(null);
  const form = useForm<SetPasswordFormType>({
    resolver: zodResolver(setPasswordSchema),
  });

  if (!window.location.hash || !window.location.hash.startsWith('#access_token')) {
    router.replace('/login');
  }

  const onSubmit = async (data: SetPasswordFormType) => {
    setServerMessage(null);

    await setPassword(data.password)
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
        <h1 className="text-2xl font-medium tracking-tight">Set your password</h1>
        <p className="text-sm text-muted-foreground">Set your password to access your account.</p>
      </div>

      {serverMessage && (
        <Alert variant={serverMessage.type === 'error' ? 'destructive' : 'success'}>
          {serverMessage.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertTitle>{serverMessage.message}</AlertTitle>
        </Alert>
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
            Set password
          </Button>
        </form>
      </Form>
    </div>
  );
}
