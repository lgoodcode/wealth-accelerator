import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

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
import { useUpdateGlobalPlaidFilter } from '../hooks/use-update-global-plaid-filter';
import { updateGlobalFilterFormSchema, type UpdateGlobalFilterFormType } from '../schema';
import { Category, type Filter } from '@/lib/plaid/types/transactions';

interface UpdateFilterDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  filter: Filter;
}

export function UpdateGlobalPlaidFilterDialog({
  open,
  onOpenChange,
  filter,
}: UpdateFilterDialogProps) {
  const updateFilter = useUpdateGlobalPlaidFilter();
  const queryClient = useQueryClient();
  const form = useForm<UpdateGlobalFilterFormType>({
    resolver: zodResolver(updateGlobalFilterFormSchema),
    values: {
      category: filter.category,
    },
  });

  const handleUpdate = async (data: UpdateGlobalFilterFormType) => {
    await updateFilter(filter.id, data)
      // Update the filters and invalidate the transactions query to force a refetch
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        onOpenChange(false);
        toast.success(
          <span>
            Updated filter <span className="font-bold">{filter.filter}</span>
          </span>
        );
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error(
          <span>
            Failed to update filter <span className="font-bold">{filter.filter}</span>
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
          <DialogTitle>Update Filter</DialogTitle>
          <DialogDescription>
            Update category for <span className="font-bold">{filter.filter}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleUpdate)}>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Category).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
              <DialogClose>
                <Button variant="secondary" disabled={form.formState.isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button loading={form.formState.isSubmitting}>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
