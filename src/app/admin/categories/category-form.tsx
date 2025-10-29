import { useEffect } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';

import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { CreateCategorySchema } from '@/src/app/admin/categories/create-category.schema';

export const CategoryForm = ({
  form,
  onSubmit,
  defaultValues,
}: {
  form: UseFormReturn<CreateCategorySchema>;
  onSubmit: SubmitHandler<CreateCategorySchema>;
  defaultValues: CreateCategorySchema | null;
}) => {
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset({ name: '', image: undefined });
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} placeholder='Name' {...field} />
              </FormControl>
              <FormDescription>Category Name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  {...form.register('image')}
                  onChange={event => {
                    field.onChange(event.target.files?.[0]);
                  }}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>Category Image</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          disabled={isSubmitting} 
          type='submit' 
          variant='outline'
          className="text-white border-white/30 hover:bg-white/20 hover:backdrop-blur-md hover:border-white/40 hover:shadow-lg transition-all duration-200"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};