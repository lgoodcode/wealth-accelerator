import { useState, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';

import { createUserFilterFormSchema, type CreateUserFilterFormType } from '../schema';
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
import { useCreateUserPlaidFilter } from '../hooks/use-create-user-plaid-filter';
import { hasUserFilterAtom } from '../atoms';
import { Category } from '@/lib/plaid/types/transactions';

export function CreateUserPlaidFilterDialog() {
  const createFilter = useCreateUserPlaidFilter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const hasFilter = useSetAtom(hasUserFilterAtom);
  const form = useForm<CreateUserFilterFormType>({
    resolver: zodResolver(createUserFilterFormSchema),
    resetOptions: {
      keepValues: true,
    },
  });

  const handleCreate = async (data: CreateUserFilterFormType) => {
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
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
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
          <DialogTitle>Create User Plaid Filter</DialogTitle>
          <DialogDescription className="flex flex-col space-y-2">
            <span>Create a new filter to categorize transactions received from Plaid.</span>
            <span>
              <span className="font-bold">Note:</span> all filters are case-insensitive and will be
              formatted to lowercase.
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
              name="user_override"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Override</FormLabel>
                  <FormDescription>
                    <span className="text-muted-foreground">
                      Will override other filters you have specified that also match.
                    </span>
                  </FormDescription>
                  <FormControl>
                    <Checkbox
                      id="enabled"
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
            <FormField
              control={form.control}
              name="global_override"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Global Override</FormLabel>
                  <FormDescription>
                    <span className="text-muted-foreground">
                      Will override filters specified by admins that also match.
                    </span>
                  </FormDescription>
                  <FormControl>
                    <Checkbox
                      id="enabled"
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
              <Button loading={form.formState.isSubmitting}>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
