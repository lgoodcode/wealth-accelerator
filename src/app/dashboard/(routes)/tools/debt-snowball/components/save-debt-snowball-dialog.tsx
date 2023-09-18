import * as z from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

interface UpdateUserDialog {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  handleSave: (name: string) => Promise<void>;
}

export function SaveDebtSnowballDialog({ open, onOpenChange, handleSave }: UpdateUserDialog) {
  const form = useForm<{ name: string }>({
    resolver: zodResolver(
      z.object({
        name: z
          .string({
            required_error: 'Please enter a name for the record',
          })
          .min(2, 'The name must be at least 2 characters long')
          .max(50, 'The name must be at most 50 characters long'),
      })
    ),
  });

  const handleSaveWithName = async (data: { name: string }) => {
    await handleSave(data.name);
  };

  useEffect(() => {
    form.reset();
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Debt Snowball Record</DialogTitle>
          <DialogDescription>
            Give a name for the record so you can reference it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSaveWithName, console.log)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" disabled={form.formState.isSubmitting}>
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
