import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { renameFormSchema, type RenameForm } from '../schema';
import { useRenameInstitution } from '../hooks/use-rename-institution';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';

interface RenameInstitutionDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  institution: ClientInstitution | null;
}

export function RenameInstitutionDialog({
  open,
  onOpenChange,
  institution,
}: RenameInstitutionDialogProps) {
  const renameInstitution = useRenameInstitution();
  const form = useForm<RenameForm>({
    resolver: zodResolver(renameFormSchema),
  });

  const handleRename = async (data: RenameForm) => {
    if (!institution) {
      return;
    }

    await renameInstitution(institution, data)
      .then(() => {
        toast.success('Institution renamed');
        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error('Failed to rename institution');
      });
  };

  useEffect(() => {
    form.reset();
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Institution</DialogTitle>
          <DialogDescription>Set a new name for this institution.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleRename)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New name</FormLabel>
                  <FormControl>
                    <Input placeholder="Institution name" {...field} />
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
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button loading={form.formState.isSubmitting} onClick={form.handleSubmit(handleRename)}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
