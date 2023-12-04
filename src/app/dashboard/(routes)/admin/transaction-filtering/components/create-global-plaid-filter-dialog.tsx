import { useState, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';

import { TRANSACTIONS_KEY } from '@/config/constants/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogTrigger,
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCreateGlobalPlaidFilter } from '../hooks/use-create-global-plaid-filter';
import { createGlobalFilterFormSchema, type CreateGlobalFilterForm } from '../schema';
import { hasGlobalFilterAtom } from '../atoms';
import { Category } from '@/lib/plaid/types/transactions';

export function CreateGlobalPlaidFilterDialog() {
  const createFilter = useCreateGlobalPlaidFilter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const hasFilter = useSetAtom(hasGlobalFilterAtom);
  const form = useForm<CreateGlobalFilterForm>({
    resolver: zodResolver(createGlobalFilterFormSchema),
  });

  const handleCreate = async (data: CreateGlobalFilterForm) => {
    if (hasFilter(data.filter)) {
      form.setError('filter', {
        type: 'manual',
        message: 'Filter already exists',
      });
      return;
    }

    await createFilter(data)
      // Update the filters and invalidate the transactions query to force a refetch
      .then(() => {
        queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
        setIsOpen(false);
        toast.success(
          <span>
            Created filter <span className="font-bold">{data.filter}</span>
          </span>
        );
      })
      .catch((error) => {
        if (error?.code === '23505') {
          toast.error(
            <span>
              Filter <span className="font-bold">{data.filter}</span> already exists
            </span>
          );
          return;
        }

        console.error(error);
        captureException(error);
        toast.error('Failed to create filter');
      });
  };

  useEffect(() => {
    form.reset();
  }, [form, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 px-2 lg:px-3">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Filter
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle>Create Global Plaid Filter</DialogTitle>
          <DialogDescription className="flex flex-col space-y-2">
            <span>
              Create a new filter to categorize transactions received from Plaid for all users.
            </span>
            <span>
              <span className="font-bold">Note:</span> all the filters are case-insensitive and will
              be formatted to lowercase.
            </span>
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
            <FormField
              control={form.control}
              name="override"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Override</FormLabel>
                  <FormDescription>
                    <span className="text-muted-foreground">
                      Will override other admin filters specified that also match.
                    </span>
                  </FormDescription>
                  <FormControl>
                    <Checkbox
                      id="override"
                      name={field.name}
                      className="w-6 h-6"
                      ref={field.ref}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" disabled={form.formState.isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" loading={form.formState.isSubmitting}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
