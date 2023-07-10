import { useState, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';

import { useCreateFilter } from '../use-create-filter';
import { createFilterFormSchema, type CreateFilterFormType } from '../schemas';
import { setFiltersAtom } from '../atoms';
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
import { Category } from '@/lib/plaid/types/transactions';

export function AddFilterButton() {
  const createFilter = useCreateFilter();
  const [isOpen, setIsOpen] = useState(false);
  const setFilters = useSetAtom(setFiltersAtom);
  const queryClient = useQueryClient();
  const form = useForm<CreateFilterFormType>({
    resolver: zodResolver(createFilterFormSchema),
  });

  const handleCreate = async (data: CreateFilterFormType) => {
    await createFilter(data)
      // Update the filters and invalidate the transactions query to force a refetch
      .then((filter) => {
        setFilters(filter);
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        setIsOpen(false);
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error('Failed to create filter');
      });
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
            <Button
              variant="secondary"
              disabled={form.formState.isSubmitting}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={form.formState.isSubmitting}
              onClick={form.handleSubmit(handleCreate)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
