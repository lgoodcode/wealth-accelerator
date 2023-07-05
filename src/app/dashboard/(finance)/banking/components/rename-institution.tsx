import { z } from 'zod';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { supabase } from '@/lib/supabase/client';
import { updateInstitutionsAtom } from '@/lib/plaid/atoms';
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
import type { ClientInstitution } from '@/lib/plaid/types/institutions';

const renameFormSchema = z.object({
  name: z.string({
    required_error: 'Please enter a name for this institution.',
  }),
});

type RenameFormType = z.infer<typeof renameFormSchema>;

const renameInstitution = async (institution: ClientInstitution, data: RenameFormType) => {
  const { error } = await supabase
    .from('plaid')
    .update({ name: data.name })
    .eq('item_id', institution.item_id);

  if (error) {
    console.error(error);
    captureException(error);
    throw error;
  }
};

interface RenameInstitutionProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  institution: ClientInstitution | null;
}

export function RenameInstitution({ open, onOpenChange, institution }: RenameInstitutionProps) {
  const updateInstitutions = useSetAtom(updateInstitutionsAtom);
  const form = useForm<RenameFormType>({
    resolver: zodResolver(renameFormSchema),
  });

  const handleRename = async (data: RenameFormType) => {
    if (!institution) {
      return;
    }

    renameInstitution(institution, data)
      .then(() => {
        toast.success('Institution renamed');
        updateInstitutions({
          ...institution,
          name: data.name,
        });
        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error('Failed to rename institution');
      });
  };

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename institution</DialogTitle>
          <DialogDescription>Set a new name for this institution.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRename)}>
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
