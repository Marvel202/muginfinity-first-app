'use client';

import { FC, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ProductsWithCategoriesResponse } from '@/src/app/admin/products/products.types';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/src/components/ui/dialog';
import {
  createOrUpdateProductSchema,
  CreateOrUpdateProductSchema,
} from '@/src/app/admin/products/schema';
import { imageUploadHandler } from '@/src/app/actions/categories';
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/src/app/actions/products';
import { ProductForm } from '@/src/app/admin/products/product-form';
import { ProductTableRow } from '@/src/app/admin/products/product-table-row';
import { CategoriesWithProductsResponse } from '../categories/categories.types';


type Props = {
  categories: CategoriesWithProductsResponse;
  productsWithCategories: ProductsWithCategoriesResponse;
};

export const ProductPageComponent: FC<Props> = ({ categories,
  productsWithCategories,
 }) => {
  const [currentProduct, setCurrentProduct] = useState<CreateOrUpdateProductSchema | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const form = useForm<CreateOrUpdateProductSchema>({
    resolver: zodResolver(createOrUpdateProductSchema),
    defaultValues: {
      title: '',
      category: undefined,
      price: undefined,
      maxQuantity: undefined,
      heroImage: undefined,
      images: [],
      intent: 'create',
    },
  });
  
  const router = useRouter()
  
  const productCreateUpdateHandler = async (data: CreateOrUpdateProductSchema) => {
    console.log('Form submitted with data:', data);
    const {category, images, maxQuantity, price, title, heroImage, slug,intent='create'} = data;
    console.log('Extracted values:', { category, images, maxQuantity, price, title, heroImage, slug, intent });

    // File size validation (300KB = 300 * 1024 bytes)
    const maxFileSize = 300 * 1024; // 300KB in bytes
    
    // Check hero image size (if provided)
    if (heroImage && heroImage.length > 0) {
      const heroFile = heroImage[0];
      if (heroFile.size > maxFileSize) {
        toast.error(`Hero image is too large (${Math.round(heroFile.size / 1024)}KB). Please upload an image smaller than 300KB.`);
        return;
      }
    }
    
    // Check product images size (if provided)
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageFile = images[i];
        if (imageFile.size > maxFileSize) {
          toast.error(`Product image ${i + 1} is too large (${Math.round(imageFile.size / 1024)}KB). Please upload images smaller than 300KB.`);
          return;
        }
      }
    }
    
    // For create intent, require images but for update, images are optional
    if (intent === 'create') {
      if (!heroImage || heroImage.length === 0) {
        toast.error('Hero image is required for new products.');
        return;
      }
      if (!images || images.length === 0) {
        toast.error('At least one product image is required for new products.');
        return;
      }
    }

    const uploadFile = async (file: File) => {
      const uniqueId = uuid();
      const fileName = `product/product-${uniqueId}-${file.name}`;
      const formData = new FormData();
      formData.append('file', new File([file], fileName));
      return await imageUploadHandler(formData);
    };

    let heroImageUrl: string | undefined;
    let imageUrls: string[] = [];

    if (heroImage) {
      const imagePromise = Array.from(heroImage).map(file => uploadFile(file as File));
      try {
        [heroImageUrl] = await Promise.all(imagePromise);
      } catch (error) {
        console.error('Error uploading hero image:', error);
        toast.error('Error uploading hero image');
        return;
      }
    }
    
    if (images.length > 0) {
      const imagesPromise = Array.from(images).map(file => uploadFile(file as File));
      try {
        imageUrls = (await Promise.all(imagesPromise)) as string[];
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error('Error uploading images');
        return;
      }
    }

    switch (intent) {
      case 'create': {
          if (heroImageUrl && imageUrls.length > 0 ) {
            await createProduct({
              category: Number(category),
              images: imageUrls,
              heroImage: heroImageUrl,
              maxQuantity: Number(maxQuantity),
              price: Number(price),
              title,
            });
            form.reset();
            router.refresh();
            setIsProductModalOpen(false);
            toast.success('Product created successfully');
          }
          break;
        }
      case 'update': {
          console.log('Update case triggered, slug:', slug);
          if (slug) {
            try {
              const updateData = {
                category: Number(category),
                maxQuantity: Number(maxQuantity),
                price: Number(price),
                title,
                slug,
                ...(heroImageUrl && { heroImage: heroImageUrl }),
                ...(imageUrls.length > 0 && { imageUrl: imageUrls }),
              };
              console.log('Sending update data:', updateData);
              console.log('Price conversion check:', { originalPrice: price, convertedPrice: Number(price), finalPrice: Math.round(Number(price) * 100) });
              
              await updateProduct(updateData);
              form.reset();
              router.refresh();
              setIsProductModalOpen(false);
              setCurrentProduct(null); // Clear current product
              toast.success('Product updated successfully');
            } catch (error) {
              console.error('Error updating product:', error);
              toast.error('Failed to update product');
            }
          } else {
            console.log('No slug provided for update');
            toast.error('Product slug is required for update');
          }
          break;
      }
      default:
        console.log('Invalid intent');
      } 
    };

    const deleteProductHandler = async () => {
      if(currentProduct?.slug) {
        await deleteProduct(currentProduct.slug);
        router.refresh();
        setIsDeleteModalOpen(false);
        toast.success('Product deleted successfully');
        setCurrentProduct(null);
      }
    };
  
    return (
      <main className='grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8'>
        <div className='container mx-auto p-4'>
          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-2xl font-bold'>Products Management</h1>
            <Button onClick={() =>{setCurrentProduct(null); setIsProductModalOpen(true);}}>
              <PlusIcon className='mr-2 h-4 w-4' />
                Add Product</Button>
          </div>
          <Card className='overflow-x-auto'>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className='min-w-[600px]'>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Max Quantity</TableHead>
                    <TableHead>Hero Image</TableHead>
                    <TableHead>Product Images</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsWithCategories.map((product) => (
                    <ProductTableRow
                      setIsProductModalOpen={setIsProductModalOpen}
                      key={product.id}
                      product={product}
                      setCurrentProduct={setCurrentProduct}
                      setIsDeleteModalOpen={setIsDeleteModalOpen}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {/* Product Create/Update Modal */}
          {isProductModalOpen && (
            <ProductForm form={form} 
            onSubmit={productCreateUpdateHandler} 
            categories={categories} 
            isProductModalOpen={isProductModalOpen} 
            setIsProductModalOpen={setIsProductModalOpen} 
            defaultValues={currentProduct} />
          )}
          {/* Delete Confirmation Modal */  } 
          {isDeleteModalOpen && (
            <Dialog
              open={isDeleteModalOpen}
              onOpenChange={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
            >
              <DialogContent className="text-white" style={{backgroundColor: '#fb4570'}}>
                <DialogHeader>
                  <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete {currentProduct?.title}?</p>
                <DialogFooter>
                  <Button
                   variant="destructive"
                    onClick={deleteProductHandler}                   
                    className="text-white border-white hover:bg-white/20 hover:backdrop-blur-md hover:border hover:border-white/30 hover:shadow-lg transition-all duration-200"
                  >
                   Cancel
                  </Button>
                  <Button
                    onClick={deleteProductHandler}
                    className="bg-white/20 text-white border border-white/30 backdrop-blur-md hover:bg-white/30 hover:border-white/40 transition-all duration-200 shadow-lg"
                  >
                   Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </main>
    );
  };

export default ProductPageComponent;