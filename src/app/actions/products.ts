'use server'

import slugify from 'slugify';
import { createClient } from '@/src/supabase/server';
import { createAdminClient } from '@/src/supabase/admin';
import { ProductsWithCategoriesResponse, type UpdateProductSchema } from '../admin/products/products.types';
import { CreateProductSchemaServer } from '../admin/products/schema';
import { revalidatePath } from 'next/dist/server/web/spec-extension/revalidate';

export const getProductsWithCategories = async (): Promise<ProductsWithCategoriesResponse> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('product')
    .select('*, category:category(id, name, imageUrl)')        
    .returns<ProductsWithCategoriesResponse>();
    if (error) throw new Error(`Error fetching products with categories: ${error.message}`);

  return data || [];
};
export const createProduct = async ({
  category,
  heroImage,
  images,
  maxQuantity,
  price,
  title,
}: CreateProductSchemaServer) => {
  const supabase = createAdminClient();
  const slug = slugify(title, { lower: true });

  const { data, error } = await supabase.from('product').insert({
    category: Number(category),
    heroImage,
    imageUrl: images,
    maxQuantity: parseInt(maxQuantity.toString()),
    price: Math.round(Number(price) * 100), // Convert to cents if database stores as integer
    title,
    slug,
  });

  if (error) {
    throw new Error(`Error creating product: ${error.message}`);
  }

  revalidatePath('/admin/products');

  return data;
};
/* export const updateProduct = async (updateData: {
  category: number;
  maxQuantity: number;
  price: number;
  title: string;
  slug: string;
  heroImage?: string;
  images?: string[];
}) => {
  // Use admin client for update operations to bypass RLS
  const supabase = createAdminClient();
  
  console.log('updateProduct called with:', updateData);
  console.log('Using admin client to bypass RLS policies');
  
  // First, let's check if the product exists with this slug
  const { data: existingProduct, error: findError } = await supabase
    .from('product')
    .select('*')
    .eq('slug', updateData.slug)
    .single();

  if (findError || !existingProduct) {
    console.error('Product lookup failed:', findError);
    console.log('Searching for products with similar titles...');
    
    // Try to find the product by title to debug
    const { data: titleSearch } = await supabase
      .from('product')
      .select('*')
      .ilike('title', `%${updateData.title}%`);
    
    console.log('Products found by title search:', titleSearch);
    throw new Error(`Product not found for update. Slug: ${updateData.slug}`);
  }

  console.log('Found existing product:', existingProduct);
  
  // Build the update object only with fields that should be updated
  const updateFields: any = {
    category: updateData.category,
    maxQuantity: updateData.maxQuantity,
    price: updateData.price.toFixed(2), // Convert to cents
    title: updateData.title,
  };

  // Only include heroImage if provided
  if (updateData.heroImage) {
    updateFields.heroImage = updateData.heroImage;
  }

  // Only include images if provided
  if (updateData.images && updateData.images.length > 0) {
    updateFields.imageUrl = updateData.images;
  }

  console.log('Updating product with data:', updateFields);
  console.log('Updating product with slug:', updateData.slug);
  
  // First, let's try a simpler update to see if it works
  console.log('Attempting update...');
  const updateQuery = supabase
    .from('product')
    .update(updateFields)
    .eq('slug', updateData.slug)
    .select();
    
  console.log('Update query built, executing...');
  const { data, error, status, statusText } = await updateQuery;

  console.log('Update query result:', { 
    data, 
    error, 
    status, 
    statusText,
    dataLength: data?.length,
    updateFieldsUsed: updateFields 
  });

  if (error) {
    console.error('Update error:', error);
    throw new Error(`Error updating product: ${error.message}`);
  }

  if (!data || data.length === 0) {
    console.log('Update query returned no data - trying alternative approach...');
    
    // Let's try updating by ID instead of slug to see if that works
    console.log('Trying update by ID instead of slug...');
    const { data: updateById, error: updateByIdError } = await supabase
      .from('product')
      .update(updateFields)
      .eq('id', existingProduct.id)
      .select();
    
    console.log('Update by ID result:', { updateById, updateByIdError });
    
    if (updateById && updateById.length > 0) {
      console.log('Update by ID succeeded!');
      revalidatePath('/admin/products');
      return updateById;
    }
    
    // Check if the product still exists (if it does, the update succeeded but no values changed)
    const { data: checkProduct } = await supabase
      .from('product')
      .select('*')
      .eq('slug', updateData.slug);
    
    if (checkProduct && checkProduct.length > 0) {
      console.log('Product exists - update succeeded but no values were changed');
      // The update "succeeded" but no rows were affected because values didn't change
      // Return the existing product data
      console.log('Updated product (no changes):', checkProduct[0]);
      revalidatePath('/admin/products');
      return checkProduct;
    } else {
      console.error('Product not found after update attempt');
      throw new Error(`Product not found for update. Slug: ${updateData.slug}`);
    }
  }

  console.log('Updated product:', data);
  revalidatePath('/admin/products');

  return data;
} */


export const updateProduct = async ({
  category,
  heroImage,
  images,
  maxQuantity,
  price,
  slug,
  title,
}: UpdateProductSchema) => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('product')
    .update({
      category,
      heroImage,
      imageUrl: images,
      maxQuantity,
      price: Number(price.toFixed(2)) * 100, // Convert to cents
      title,
    })
    .match({ slug })
    .select();

  if (error) {
    throw new Error(`Error updating product: ${error.message}`);
  }

  revalidatePath('/admin/products');

  return data;
};
export const deleteProduct = async (slug: string) => {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('product')
    .delete()
    .eq('slug', slug);
  if (error) throw new Error(`Error deleting product: ${error.message}`);

  revalidatePath('/admin/products');
}