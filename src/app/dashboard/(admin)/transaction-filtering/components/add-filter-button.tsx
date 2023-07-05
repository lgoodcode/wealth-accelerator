import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';

import { setFiltersAtom } from '../atoms';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const createFilterFormSchema = z.object({
  filter: z.string({
    required_error: 'Please enter a filter for this filter.',
  }),
  category: z.nativeEnum(Category, {
    required_error: 'Please select a category for this filter.',
  }),
});

type CreateFilterFormType = z.infer<typeof createFilterFormSchema>;

const createFilter = async (filter: Pick<Filter, 'filter' | 'category'>) => {
  const { error: insertError, data: newFilter } = await supabase
    .from('plaid_filters')
    .insert(filter)
    .select('*')
    .single();

  if (insertError || !newFilter) {
    throw insertError || new Error('Failed to insert filter');
  }

  return newFilter as Filter;
};

export function AddFilterButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setFilters = useSetAtom(setFiltersAtom);
  const queryClient = useQueryClient();
  const form = useForm<CreateFilterFormType>({
    resolver: zodResolver(createFilterFormSchema),
  });

  const handleCreate = (data: CreateFilterFormType) => {
    setIsLoading(true);

    createFilter(data)
      // Update the filters and invalidate the transactions query to force a refetch
      .then((filter) => {
        toast.success('Filter created');
        setFilters(filter);
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        setIsOpen(false);
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error('Failed to create filter');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [form, isOpen]);

  return (
    <>
      <Button className="h-8 px-2 lg:px-3" onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add filter
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create filter</DialogTitle>
            <DialogDescription>
              Create a new filter to categorize transactions when received from Plaid.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleCreate)}>
              <FormField
                control={form.control}
                name="filter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filter text</FormLabel>
                    <FormControl>
                      <Input placeholder="Filter text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            <Button variant="secondary" disabled={isLoading} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading} onClick={form.handleSubmit(handleCreate)}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
