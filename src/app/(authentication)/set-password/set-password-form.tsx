'use client';

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
import { setPasswordSchema, type SetPasswordFormType } from '@/lib/user-schema';
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
            Set password
          </Button>
        </form>
      </Form>
    </div>
  );
}
