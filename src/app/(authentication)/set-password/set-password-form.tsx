'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils/cn';
import { setPasswordSchema, type SetPasswordForm } from '@/lib/user-schema';
import { useSetPassword } from '@/hooks/auth/use-set-password';
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

export function SetPasswordForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const setPassword = useSetPassword();
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(null);
  const form = useForm<SetPasswordForm>({
    resolver: zodResolver(setPasswordSchema),
  });

  const onSubmit = async (data: SetPasswordForm) => {
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

  useEffect(() => {
    // if ((window && !window.location.hash) || !window.location.hash.startsWith('#access_token')) {
    //   router.replace('/login');
    // }
  }, []);

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-medium tracking-tight">Set your password</h1>
        <p className="text-sm text-muted-foreground">Set your password to access your account.</p>
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
            Set Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
