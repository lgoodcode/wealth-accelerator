'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

const dateFormSchema = z.object({
  date: z.date({
    required_error: 'Select a date.',
  }),
});

type DateFormType = z.infer<typeof dateFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<DateFormType> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
};

export function DateForm() {
  const form = useForm<DateFormType>({
    resolver: zodResolver(dateFormSchema),
    defaultValues,
  });

  const onSubmit = (data: DateFormType) => {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, console.log)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <DatePicker initialDate={field.value} onSelect={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        */}
        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  );
}
