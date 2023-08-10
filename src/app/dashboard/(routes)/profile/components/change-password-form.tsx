'use client';

import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { changePasswordSchema, type ChangePasswordFormType } from '@/lib/user-schema';
import { useUpdatePassword } from '../hooks/use-update-password';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function ChangePasswordForm() {
  const updatePassword = useUpdatePassword();
  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleUpdatePassword = async (data: ChangePasswordFormType) => {
    await updatePassword(data.current_password, data.new_password)
      .then(() => {
        toast.success('Password updated successfully');
        form.reset();
      })
      .catch((error) => {
        console.error(error);

        if (error.message === 'Incorrect password') {
          form.setError('current_password', {
            type: 'manual',
            message: error.message,
          });
        } else {
          captureException(error);
          toast.error('Failed to update password');
        }
      });
  };

  return (
    <div className="p-4 border">
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(handleUpdatePassword, console.log)}
          className="space-y-8"
        >
          <h3 className="text-xl font-semibold">Change Password</h3>

          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex gap-2 justify-end">
            <Button type="button" variant="secondary" className="ml-2" onClick={() => form.reset()}>
              Cancel
            </Button>
            <Button type="submit" loading={form.formState.isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
