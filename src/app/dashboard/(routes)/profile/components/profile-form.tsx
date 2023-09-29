'use client';

import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { profileSchema, type ProfileFormType } from '@/lib/user-schema';
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
import { useUpdateProfile } from '../hooks/use-update-profile';

interface ProfileFormProps {
  user: ProfileFormType;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const updateProfile = useUpdateProfile();
  const form = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const handleUpdateProfile = async (data: ProfileFormType) => {
    await updateProfile(data)
      .then((profile) => {
        toast.success('Profile updated successfully');
        form.reset({
          name: profile.name,
          email: profile.email,
        });
      })
      .catch((error) => {
        console.error(error);

        if (error.message === 'Email already in use') {
          form.setError('email', {
            type: 'manual',
            message: error.message,
          });
          return;
        } else {
          captureException(error);
          toast.error('Failed to update profile');
        }
      });
  };

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-8">
        <h3 className="text-xl font-semibold">Profile</h3>
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

        <div className="w-full flex gap-2 justify-end">
          <Button type="button" variant="secondary" className="ml-2" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={form.formState.isSubmitting}
            disabled={!form.formState.isDirty}
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
