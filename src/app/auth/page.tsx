'use client';

import { authenticate } from './../actions/auth'
import { Button } from '@/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export default function Auth() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const router = useRouter();

  const onSubmit = async ({ email, password }: z.infer<typeof loginSchema>) => {
    setIsAuthenticating(true);

    try {
      console.log(email, password);
      await authenticate(email, password);
      router.push('/admin');
    } catch {
      // Error handling can be added here if needed
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className='flex h-svh items-center justify-center'>
      <div className='mx-auto grid w-[350px] gap-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel htmlFor='email'>Email</FormLabel>
                  <FormControl>
                    <Input
                      id='email'
                      type='email'
                      placeholder='m@example.com'
                      {...field}
                      disabled={isAuthenticating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <div className='flex items-center'>
                    <FormLabel htmlFor='password'>Password</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      disabled={isAuthenticating}
                      id='password'
                      type='password'
                      {...field}
                    />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isAuthenticating}
              type='submit'
              className='w-full bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-md font-medium'
              style={{
                backgroundColor: '#1e293b',
                color: '#ffffff',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                fontWeight: '500',
                cursor: isAuthenticating ? 'not-allowed' : 'pointer',
                opacity: isAuthenticating ? 0.5 : 1
              }}
            >
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}