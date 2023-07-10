import { useState, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';

import { useCreateNotifier } from '../use-create-notifier';
import { addNotifierAtom } from '../atoms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
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
import { notifierFormSchema, type NotifierFormType } from '../schema';

export function AddNotifierButton() {
  const createNotifier = useCreateNotifier();
  const [isOpen, setIsOpen] = useState(false);
  const addNotifier = useSetAtom(addNotifierAtom);
  const form = useForm<NotifierFormType>({
    resolver: zodResolver(notifierFormSchema),
    defaultValues: {
      name: '',
      email: '',
      enabled: true,
    },
  });

  const handleCreate = async (data: NotifierFormType) => {
    await createNotifier(data)
      .then((notifier) => {
        addNotifier(notifier);
        setIsOpen(false);
      })
      .catch((error) => {
        if (error.code && error.code === '23505') {
          form.setError('email', {
            type: 'manual',
            message: 'Email is already in use',
          });
          return;
        }

        console.error(error);
        captureException(error);
        toast.error('Failed to create notifier');
      });
  };

  useEffect(() => {
    form.reset();
  }, [form, isOpen]);

  return (
    <>
      <Button className="h-8 px-2 lg:px-3" onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add notifier
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Notifier</DialogTitle>
            <DialogDescription>
              Create a new notifier to be emailed for shared Creative Cash Flow Records.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(createNotifier)}>
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
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Enabled</FormLabel>
                    <FormControl>
                      <Checkbox
                        name={field.name}
                        className="w-6 h-6"
                        ref={field.ref}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button
              variant="secondary"
              disabled={form.formState.isSubmitting}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={form.formState.isSubmitting}
              onClick={form.handleSubmit(handleCreate)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
