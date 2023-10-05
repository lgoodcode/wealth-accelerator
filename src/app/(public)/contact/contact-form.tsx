'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { contactSchema, type ContactFormType } from './schema';
import { Textarea } from '@/components/ui/textarea';

export function ContactForm() {
  const form = useForm<ContactFormType>({
    resolver: zodResolver(contactSchema),
  });

  const handleContact = async (data: ContactFormType) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleContact)}>
        <div className="grid lg:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="lg:col-span-1">
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input className="bg-white" placeholder="Full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="lg:col-span-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="bg-white" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="lg:col-span-2">
                <FormLabel>How can we help you?</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-[180px] bg-white"
                    placeholder="Describe your problem"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full lg:col-span-2 flex justify-center">
          <Button className="py-3">Send Message</Button>
        </div>
      </form>
    </Form>
  );
}
