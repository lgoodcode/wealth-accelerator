import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { globalFiltersAtom } from '../atoms';
import { useDeleteUserPlaidFilter } from '../hooks/use-delete-user-plaid-filter';
import { deleteUserFilterFormSchema, type DeleteUserFilterFormType } from '../schema';
import type { UserFilter } from '@/lib/plaid/types/transactions';

interface DeleteUserPlaidFilterDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  filter: UserFilter;
}

export function DeleteUserPlaidFilterDialog({
  open,
  onOpenChange,
  filter,
}: DeleteUserPlaidFilterDialogProps) {
  const deleteFilter = useDeleteUserPlaidFilter();
  const queryClient = useQueryClient();
  const globalFilters = useAtomValue(globalFiltersAtom);
  const form = useForm<DeleteUserFilterFormType>({
    resolver: zodResolver(deleteUserFilterFormSchema),
  });
  const matchingGlobalFilters = !globalFilters
    ? []
    : globalFilters.filter((globalFilter) => {
        return new RegExp(globalFilter.filter, 'i').test(filter.filter);
      });

  const handleDelete = async ({ global_filter_id }: DeleteUserFilterFormType) => {
    await deleteFilter(filter.id, global_filter_id)
      // Update the filters and invalidate the transactions query to force a refetch
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        toast.success(
          <span>
            Filter <span className="font-bold">{filter.filter}</span> has been removed
          </span>
        );
        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          <span>
            Failed to remove filter <span className="font-bold">{filter.filter}</span>
          </span>
        );
      });
  };

  useEffect(() => {
    form.reset();
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Filter <b className="font-bold italic">{filter.filter}</b>
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription>
          Select either the default category, which will categorize based on the transaction&apos;s
          amount, or a global filter to re-categorize the transactions.
        </AlertDialogDescription>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleDelete)}>
            <FormField
              control={form.control}
              name="global_filter_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={(id) => field.onChange(Number(id))}
                    >
                      <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[400px]">
                        <SelectItem value="-1">Default Category</SelectItem>
                        {matchingGlobalFilters.map((filter) => (
                          <SelectItem
                            className="w-full flex flex-row justify-between"
                            key={`global-filter-${filter.id}`}
                            value={String(filter.id)}
                          >
                            <span>{filter.filter}</span>
                            <span className="font-bold mx-2">-&gt;</span>
                            <span>{filter.category}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel disabled={form.formState.isSubmitting}>Cancel</AlertDialogCancel>
              <Button type="submit" variant="destructive" loading={form.formState.isSubmitting}>
                Delete
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
