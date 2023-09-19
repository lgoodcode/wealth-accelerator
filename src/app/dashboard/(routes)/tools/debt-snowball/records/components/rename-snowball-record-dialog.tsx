import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

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
import { useRenameSnowballRecord } from '../../hooks/use-rename-snowball-record';
import { DebtSnowballRecord } from '../../types';

interface UpdateUserDialog {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  record: DebtSnowballRecord;
}

export function RenameSnowballRecordDialog({ open, onOpenChange, record }: UpdateUserDialog) {
  const router = useRouter();
  const renameSnowballRecord = useRenameSnowballRecord();
  const form = useForm<{ name: string }>({
    resolver: zodResolver(
      z.object({
        name: z
          .string()
          .nonempty({ message: 'Must enter a name' })
          .min(2, { message: 'Must be at least 2 characters long' })
          .max(50, { message: 'Must be at most 50 characters long' }),
      })
    ),
  });

  const handleRenameSnowballRecord = async (data: { name: string }) => {
    await renameSnowballRecord(record.id, data.name)
      .then(() => {
        onOpenChange(false);
        // Refresh the page so that the name is updated in the breadcrumbs and when navigating
        // back from the record page to the records page
        router.refresh();
      })
      .catch((error) => {
        console.error(error);
        captureException(error, {
          extra: { id: record.id },
        });
        toast.error(
          <span>
            Failed to rename record <span className="font-bold">{record.name}</span>
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
          <DialogTitle>Rename Debt Snowball Record</DialogTitle>
          <DialogDescription>
            Update the name for <span className="font-bold">{record.name}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleRenameSnowballRecord)}>
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
