'use client'

import * as React from 'react'
import * as z from 'zod'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Your name must contain at least 2 characters')
    .max(50, 'Name is too long'),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(50, 'Password is too long')
    .refine((value) => /[a-z]+/.test(value), {
      message: 'Password must contain at least one lowercase letter',
    })
    .refine((value) => /[A-Z]+/.test(value), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine((value) => /[0-9]+/.test(value), {
      message: 'Password must contain at least one number',
    })
    .refine((value) => /[!@#$%&'*+/=?^_`{|}~-]+/.test(value), {
      message: 'Password must contain at least one special character',
    }),
})

export default function RegisterForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-medium tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your name, email, and password below to create your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner className="mr-2" />}
            Sign Up
          </Button>
        </form>
      </Form>

      <div className="mx-auto">
        <span>Already have an account?</span>{' '}
        <Link href="/login" className="hover:underline underline-offset-4 text-blue-500">
          Sign In
        </Link>
      </div>
    </div>
  )
}
