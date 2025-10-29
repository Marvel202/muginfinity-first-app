'use server';

import slugify from 'slugify';

import { CategoriesWithProductsResponse } from '@/src/app/admin/categories/categories.types';
import {
  CreateCategorySchemaServer,
  UpdateCategorySchema,
} from '@/src/app/admin/categories/create-category.schema';
import { createClient } from '@/src/supabase/server';
import { createAdminClient } from '@/src/supabase/admin';
import { revalidatePath } from 'next/cache';

export const getCategoriesWithProducts =
  async (): Promise<CategoriesWithProductsResponse> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('category')
      .select('* , products:product(*)')
      .returns<CategoriesWithProductsResponse>();

    if (error) throw new Error(`Error fetching categories: ${error.message}`);

    return data || [];
  };

export const imageUploadHandler = async (formData: FormData) => {
  const supabase = await createClient();
  if (!formData) return;

  const fileEntry = formData.get('file');

  if (!(fileEntry instanceof File)) throw new Error('Expected a file');

  const fileName = fileEntry.name;

  try {
    const { data, error } = await supabase.storage
      .from('app-images')
      .upload(fileName, fileEntry, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw new Error('Error uploading image');
    }

    const {
      data: { publicUrl },
    } = await supabase.storage.from('app-images').getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Error uploading image');
  }
};

export const createCategory = async ({
  imageUrl,
  name,
}: CreateCategorySchemaServer) => {
  const supabase = createAdminClient();
  const slug = slugify(name, { lower: true });

  const { data, error } = await supabase.from('category').insert({
    name,
    imageUrl,
    slug,
  });

  if (error) throw new Error(`Error creating category: ${error.message}`);

  revalidatePath('/admin/categories');

  return data;
};


export const updateCategory = async ({
  imageUrl,
  name,
  slug: originalSlug,
}: UpdateCategorySchema) => {
  const supabase = createAdminClient();
  const newSlug = slugify(name, { lower: true });

  const { data, error } = await supabase
    .from('category')
    .update({
      name,
      imageUrl,
      slug: newSlug,
    })
    .eq('slug', originalSlug)
    .select(); // Add select to return updated data

  if (error) {
    console.error('Update error:', error);
    throw new Error(`Error updating category: ${error.message}`);
  }

  if (!data || data.length === 0) {
    console.error('No category found with slug:', originalSlug);
    throw new Error('Category not found for update');
  }

  console.log('Updated category:', data);
  revalidatePath('/admin/categories');

  return data;
};

export const deleteCategory = async (id: number) => {
  const supabase = createAdminClient();

  const { error } = await supabase.from('category').delete().match({ id });

  if (error) throw new Error(`Error deleting category: ${error.message}`);

};

export const getCategoryData = async () => {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('category')
    .select('name, products:product(count)');

  if (error) throw new Error(`Error fetching category data: ${error.message}`);

  // Transform the data to match the expected format
  return data.map((category: {name: string; products: {count: number}[] }) => ({
    name: category.name,
    products: category.products[0]?.count || 0,
  }));
};

export const getCategoryAvailability = async () => {
  const supabase = await createClient();
  
  // Get all products with their availability
  const { data, error } = await supabase
    .from('product')
    .select('title, maxQuantity, category:category(name)');

  if (error) throw new Error(`Error fetching product availability: ${error.message}`);

  // Transform the data to show product name and available quantity
  return data.map((product: {title: string; maxQuantity: number; category: {name: string} }) => ({
    name: product.title,
    available: product.maxQuantity || 0,
    category: product.category.name,
  }));
};



