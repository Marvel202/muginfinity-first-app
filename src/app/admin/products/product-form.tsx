import { Dispatch, SetStateAction, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/src/components/ui/dialog';
import { CreateOrUpdateProductSchema } from '@/src/app/admin/products/schema';
import { Input } from '@/src/components/ui/input';
import { Category } from '@/src/app/admin/categories/categories.types';
import { Button } from '@/src/components/ui/button';

type Props = {
  form: UseFormReturn<CreateOrUpdateProductSchema>;
  onSubmit: (data: CreateOrUpdateProductSchema) => void;
  categories: Category[];
  setIsProductModalOpen: Dispatch<SetStateAction<boolean>>;
  isProductModalOpen: boolean;
  defaultValues: CreateOrUpdateProductSchema | null;
};

export const ProductForm = ({
  form,
  onSubmit,
  categories,
  setIsProductModalOpen,
  isProductModalOpen,
  defaultValues,
}: Props) => {
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset({
        title: '',
        category: '',
        price: '',
        maxQuantity: '',
        heroImage: undefined,
        images: undefined,
      });
    }
  }, [defaultValues, form]);

  return (
    <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
      <DialogContent className="border border-pink-600 text-white" style={{backgroundColor: '#fb4570'}}>
        <DialogHeader>
          <DialogTitle className="text-white">
            {defaultValues?.intent === 'update' ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>
        <div
          className='max-h-[calc(100svh-200px)] overflow-y-auto'
          style={{
            scrollbarWidth: 'none' /* Firefox */,
            msOverflowStyle: 'none' /* Internet Explorer 10+ */,
          }}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='grid gap-4 py-4'
            >
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className="text-white">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter product title'
                        {...field}
                        className='col-span-3'
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className="text-white">Category</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger
                          disabled={isSubmitting}
                          className='col-span-3 bg-white border-transparent text-gray-900'
                        >
                          <SelectValue placeholder='Select a category' />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-transparent">
                          {categories.map(category => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                              className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                            >
                              {category.name}
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
                name='price'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className="text-white">Price</FormLabel>
                    <FormControl>
                      <Input
                        id='price'
                        type='number'
                        className='col-span-3'
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='maxQuantity'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className="text-white">Max Quantity</FormLabel>
                    <FormControl>
                      <Input
                        id='maxQuantity'
                        type='number'
                        className='col-span-3'
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='heroImage'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className="text-white">Hero Image</FormLabel>
                    <FormControl className='col-span-3'>
                      <Input
                        type='file'
                        accept='image/*'
                        {...form.register('heroImage')}
                        onChange={event => {
                          field.onChange(event.target.files?.[0]);
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='images'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className="text-white">Product Images</FormLabel>
                    <FormControl className='col-span-3'>
                      <Input
                        type='file'
                        accept='image/*'
                        multiple
                        {...form.register('images')}
                        onChange={event => {
                          field.onChange(event.target.files);
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  disabled={isSubmitting} 
                  type='submit'
                  className="text-white border-white/30 hover:bg-white/20 hover:backdrop-blur-md hover:border-white/40 hover:shadow-lg transition-all duration-200"
                >
                  {defaultValues?.intent === 'update' ? 'Edit Product' : 'Add Product'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
