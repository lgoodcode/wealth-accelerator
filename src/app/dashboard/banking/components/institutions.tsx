'use client';

import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { supabase } from '@/lib/supabase/client';
import { fetcher } from '@/lib/utils/fetcher';
import { toast } from '@/hooks/use-toast';
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
import type { Institution } from '@/lib/plaid/types/institutions';

const renameFormSchema = z.object({
  name: z.string({
    required_error: 'Please enter a name for this institution.',
  }),
});

interface InstitutionsProps {
  institutions: Institution[];
}

export function Institutions({ institutions }: InstitutionsProps) {
  const router = useRouter();
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const form = useForm<z.infer<typeof renameFormSchema>>({
    resolver: zodResolver(renameFormSchema),
  });

  const handleCloseRenameDialog = useCallback(() => {
    form.reset();
    setShowRenameDialog(false);
  }, [form]);

  const onSubmitRename = async (data: z.infer<typeof renameFormSchema>) => {
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
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
      return;
    }

    toast({
      variant: 'success',
      title: 'Success',
      description: 'Institution renamed successfully.',
    });

    setSelectedInstitution(null);
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
      toast({
        variant: 'destructive',
        title: 'Error',
        description: supabaseError.message,
      });
      return;
    }
    // Revoke access token
    const { error: plaidError } = await fetcher(
      `/api/plaid/institutions/remove/${selectedInstitution.access_token}`,
      {
        method: 'DELETE',
      }
    );

    // Don't show error for revoking the access token
    if (plaidError) {
      console.error(plaidError);
      captureException(plaidError);
    }

    setIsWaiting(false);
    setShowDeleteDialog(false);
    setSelectedInstitution(null);
    router.refresh();
  }, [selectedInstitution, router]);

  return (
    <div className="flex w-full h-20 items-center gap-4">
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

      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename institution</DialogTitle>
            <DialogDescription>Set a new name for this institution.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form>
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
            <Button variant="secondary" onClick={handleCloseRenameDialog}>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete} loading={isWaiting}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
