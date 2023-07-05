import { z } from 'zod';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { setFiltersAtom } from '../atoms';
import { supabase } from '@/lib/supabase/client';
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
import { Category, type Filter } from '@/lib/plaid/types/transactions';

const updateFilterFormSchema = z.object({
  category: z.nativeEnum(Category, {
    required_error: 'Please select a category for this filter.',
  }),
});

type UpdateFilterFormType = z.infer<typeof updateFilterFormSchema>;

const updateFilter = async (id: number, data: UpdateFilterFormType) => {
  const { error } = await supabase
    .from('plaid_filters')
    .update({ category: data.category })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }
};

interface UpdateFilterProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  filter: Filter;
}

export function UpdateFilterModal({ open, onOpenChange, filter }: UpdateFilterProps) {
  const queryClient = useQueryClient();
  const setFilters = useSetAtom(setFiltersAtom);
  const form = useForm<UpdateFilterFormType>({
    resolver: zodResolver(updateFilterFormSchema),
    values: {
      category: filter.category,
    },
  });

  const handleUpdate = async (data: UpdateFilterFormType) => {
    updateFilter(filter.id, data)
      // Update the filters and invalidate the transactions query to force a refetch
      .then(() => {
        setFilters({
          ...filter,
          category: data.category,
        });
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error(
          <span>
            Failed to remove filter <span className="font-bold">{filter.filter}</span>
          </span>
        );
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
          <DialogTitle>Update filter</DialogTitle>
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
          </form>
        </Form>
        <DialogFooter>
          <Button
            variant="secondary"
            disabled={form.formState.isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={form.formState.isSubmitting}
            onClick={form.handleSubmit(handleUpdate)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
