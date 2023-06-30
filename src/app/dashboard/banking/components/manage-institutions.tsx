'use client';

import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { supabase } from '@/lib/supabase/client';
import { fetcher } from '@/lib/utils/fetcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InstitutionSelection } from './institution-selection';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectedInstitutionAtom, setSelectedInstitutionAtom } from '@/lib/atoms/institutions';

const renameFormSchema = z.object({
  name: z.string({
    required_error: 'Please enter a name for this institution.',
  }),
});

type RenameFormType = z.infer<typeof renameFormSchema>;

interface InstitutionsProps {
  institutions: ClientInstitution[];
}

export function ManageInstitutions({ institutions }: InstitutionsProps) {
  const router = useRouter();
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const selectedInstitution = useAtomValue(selectedInstitutionAtom);
  const setSelectedInstitution = useSetAtom(setSelectedInstitutionAtom);
  const form = useForm<RenameFormType>({
    resolver: zodResolver(renameFormSchema),
  });

  const handleCloseRenameDialog = useCallback(() => {
    form.reset();
    setShowRenameDialog(false);
  }, [form]);

  const handleRenameDialogOpenChange = useCallback(
    (open: boolean) => {
      form.reset();
      setShowRenameDialog(open);
    },
    [form]
  );

  const onSubmitRename = async (data: RenameFormType) => {
    if (!selectedInstitution) {
      return;
    }

    const { error } = await supabase
      .from('plaid')
      .update({ name: data.name })
      .eq('item_id', selectedInstitution.item_id);

    if (error) {
      console.error(error);
      captureException(error);
      toast.error('Uh oh! Something went wrong. Please try again.');
      return;
    }

    toast.success('Institution name updated');

    // Update the institution name in the list
    setSelectedInstitution((prev) => {
      if (!prev) {
        return null;
      }

      return {
        ...prev,
        name: data.name,
      };
    });
    setShowRenameDialog(false);
    router.refresh();
  };

  const handleDelete = useCallback(async () => {
    if (!selectedInstitution) {
      return;
    }

    setIsWaiting(true);

    const { error: supabaseError } = await supabase
      .from('plaid')
      .delete()
      .eq('item_id', selectedInstitution.item_id);

    if (supabaseError) {
      console.error(supabaseError);
      captureException(supabaseError);
      setIsWaiting(false);
      toast.error('Uh oh! Something went wrong. Please try again.');
      return;
    }

    // Revoke access token
    const { error: plaidError } = await fetcher(
      `/api/plaid/institutions/remove/${selectedInstitution.item_id}`,
      {
        method: 'DELETE',
      }
    );

    // Don't show error for revoking the access token
    if (plaidError) {
      console.error(plaidError);
    }

    toast.success(`Institution ${selectedInstitution.name} has been removed`);

    setIsWaiting(false);
    setShowDeleteDialog(false);
    setSelectedInstitution(null);
    // Refresh the page to update the data
    router.refresh();
  }, [selectedInstitution, setSelectedInstitution, router]);

  return (
    <div className="flex flex-col lg:flex-row w-full items-center justify-start">
      <div className="w-full mr-auto py-4">
        <h2 className="text-3xl font-medium tracking-tighter">
          {selectedInstitution?.name ?? 'Select an institution'}
        </h2>
      </div>

      <div className="flex h-20 w-full justify-start lg:justify-end items-center space-x-2">
        <InstitutionSelection
          institutions={institutions}
          selectedInstitution={selectedInstitution}
          setSelectedInstitution={setSelectedInstitution}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" disabled={!selectedInstitution}>
              <span className="sr-only">Actions</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={() => setShowRenameDialog(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setShowDeleteDialog(true)}
              className="text-red-600 font-medium"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={showRenameDialog} onOpenChange={handleRenameDialogOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename institution</DialogTitle>
              <DialogDescription>Set a new name for this institution.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitRename)}>
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
                onClick={handleCloseRenameDialog}
              >
                Close
              </Button>
              <Button
                type="submit"
                loading={form.formState.isSubmitting}
                onClick={form.handleSubmit(onSubmitRename)}
              >
                Rename
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This institution and all the data associated with it
                will be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isWaiting}>Cancel</AlertDialogCancel>
              <Button variant="destructive" onClick={handleDelete} loading={isWaiting}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
