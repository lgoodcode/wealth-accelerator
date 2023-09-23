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
import { useUpdateUserPlaidFilter } from '../hooks/use-update-user-plaid-filter';
import { updateUserFilterFormSchema, type UpdateUserFilterFormType } from '../schema';
import { Category, type UserFilter } from '@/lib/plaid/types/transactions';

interface UpdateFilterDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  filter: UserFilter;
}

export function UpdateUserPlaidFilterDialog({
  open,
  onOpenChange,
  filter,
}: UpdateFilterDialogProps) {
  const updateFilter = useUpdateUserPlaidFilter();
  const queryClient = useQueryClient();
  const form = useForm<UpdateUserFilterFormType>({
    resolver: zodResolver(updateUserFilterFormSchema),
    values: {
      category: filter.category,
    },
  });

  const handleUpdate = async (data: UpdateUserFilterFormType) => {
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
          <DialogTitle>Update User Plaid Filter</DialogTitle>
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
