'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { fetcher } from '@/lib/utils/fetcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { contactSchema, type ContactFormType } from './schema';
import type { ServerMessage } from '@/lib/types/public';

export function ContactForm() {
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(null);
  const form = useForm<ContactFormType>({
    resolver: zodResolver(contactSchema),
  });

  const handleContact = async (data: ContactFormType) => {
    await fetcher('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        setServerMessage({
          type: 'success',
          message: 'Your message has been sent',
        });
      })
      // No captureException here because it'll already be captured in the server
      .catch((error) => {
        console.error(error);
        setServerMessage({
          type: 'error',
          message: 'Something went wrong. Please try again later.',
        });
      });
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleContact)}>
        <div className="grid lg:grid-cols-2 gap-8">
          {serverMessage && (
            <div className="lg:col-span-2">
              <Alert variant={serverMessage.type === 'error' ? 'destructive' : 'success'}>
                <AlertTitle>{serverMessage.message}</AlertTitle>
              </Alert>
            </div>
          )}

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
          <Button className="py-3" loading={form.formState.isSubmitting}>
            Send Message
          </Button>
        </div>
      </form>
    </Form>
  );
}
