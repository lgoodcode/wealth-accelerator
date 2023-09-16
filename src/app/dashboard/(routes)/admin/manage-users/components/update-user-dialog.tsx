import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { updateUserFormSchema, type UpdateUserFormType } from '@/lib/user-schema';
import { Role } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUpdateUser } from '../hooks/use-update-user';

interface UpdateUserDialog {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  id: string;
  user: User;
}

export function UpdateUserDialog({ open, onOpenChange, id, user }: UpdateUserDialog) {
  const updateUser = useUpdateUser();
  const form = useForm<UpdateUserFormType>({
    resolver: zodResolver(updateUserFormSchema),
    values: user as UpdateUserFormType,
  });

  const handleUpdate = async (data: UpdateUserFormType) => {
    await updateUser(user.id, data, id === user.id)
      .then(() => {
        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);

        if (error?.code === '23505') {
          form.setError('email', {
            type: 'manual',
            message: 'Email is already in use',
          });
          return;
        }

        captureException(error, {
          extra: { id: user.id, data },
        });
        toast.error(
          <span>
            Failed to update user <span className="font-bold">{user.name}</span>
          </span>
        );
      });
  };

  useEffect(() => {
    form.reset();
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update user</DialogTitle>
          <DialogDescription>
            Update user details for <span className="font-bold">{user.name}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleUpdate)}>
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={id === user.id}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Role).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role === Role.ADMIN ? 'Admin' : 'User'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={form.formState.isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" loading={form.formState.isSubmitting}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
