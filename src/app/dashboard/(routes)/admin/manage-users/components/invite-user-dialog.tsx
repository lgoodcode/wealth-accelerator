import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogTrigger,
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
import { useInviteUser } from '../hooks/use-invite-user';
import { inviteUserSchema, type InviteUserFormType } from '../schema';

export function InviteUserDialog() {
  const inviteUser = useInviteUser();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<InviteUserFormType>({
    resolver: zodResolver(inviteUserSchema),
  });

  const handleInvite = async (data: InviteUserFormType) => {
    await inviteUser(data)
      .then(() => {
        setIsOpen(false);
        toast.success(`Invite email sent to ${data.email}`);
      })
      .catch((error) => {
        console.error(error);

        if (error.message === 'Email is already in use') {
          form.setError('email', {
            type: 'manual',
            message: 'Email is already in use',
          });
          return;
        }

        captureException(error);
        toast.error('Failed to send invite email');
      });
  };

  useEffect(() => {
    form.reset();
  }, [form, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 px-2 lg:px-3">
          <PlusCircle className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>Enter the name and email of the user to invite.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleInvite)}>
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

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={form.formState.isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                loading={form.formState.isSubmitting}
                onClick={form.handleSubmit(handleInvite)}
              >
                Invite
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
