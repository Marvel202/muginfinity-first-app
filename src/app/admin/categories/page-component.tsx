'use client';

import { FC, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PlusCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';

import { CategoryTableRow } from '@/src/components/category';
import {
  createCategorySchema,
  CreateCategorySchema,
} from '@/src/app/admin/categories/create-category.schema';
import { CategoriesWithProductsResponse, CategoryWithProducts } from '@/src/app/admin/categories/categories.types';
import { CategoryForm } from '@/src/app/admin/categories/category-form';
import {
  createCategory,
  deleteCategory,
  imageUploadHandler,
  updateCategory,
} from '@/src/app/actions/categories';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  categories: CategoriesWithProductsResponse;
};

const CategoriesPageComponent: FC<Props> = ({ categories }) => {
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CreateCategorySchema | null>(null);
  const [originalCategory, setOriginalCategory] = useState<CategoryWithProducts | null>(null);

  const form = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      image: undefined,
    },
  });


  const router = useRouter();

  const submitCategoryHandler: SubmitHandler<CreateCategorySchema> = async data => {
    const { image, name, intent = 'create' } = data; 

    const handleImageUpload = async () => {
      const uniqueId = uuidv4();
      const originalFile = data.image[0];
      const fileName = `category/category-${uniqueId}`;
      const file = new File([originalFile], fileName, { type: originalFile.type });
      const formData = new FormData();
      formData.append('file', file);
    // upload image to supabase storage
     return imageUploadHandler(formData);
 
    };
    switch (intent) {
      case 'create': {
          try {
            const imageUrl = await handleImageUpload();
            if (!imageUrl) {
              throw new Error('Failed to upload image');
            }
            await createCategory({ imageUrl, name });
            form.reset();
            router.refresh();
            setIsCreateCategoryModalOpen(false);
            toast.success('Category created successfully');
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            toast.error(`Error creating category: ${errorMessage}`);
          }
          break;
      }
      case 'update': {
        if(currentCategory?.slug && originalCategory) {
          try {
            let imageUrl = originalCategory.imageUrl; // Use existing image by default
            
            // Only upload new image if one is provided
            if(image && image.length > 0) {
              const newImageUrl = await handleImageUpload();
              if (!newImageUrl) {
                throw new Error('Failed to upload image');
              }
              imageUrl = newImageUrl;
            }
            
            await updateCategory({ 
              imageUrl,
              name: data.name, 
              slug: currentCategory.slug,
              intent: 'update' 
            });
            form.reset();
            router.refresh();
            setIsCreateCategoryModalOpen(false);
            toast.success('Category updated successfully');
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            toast.error(`Error updating category: ${errorMessage}`);
          }
        }
        break;
      }
        default: 
          console.log('Invalid intent');
      }
    };
  
    const deleteCategoryHandler = async (id: number) => {
      try {
        await deleteCategory(id);
        router.refresh();
        toast.success('Category deleted successfully');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        toast.error(`Error deleting category: ${errorMessage}`);
      }
    };

  return (
    <main className='grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='flex items-center my-10'>
        <div className='ml-auto flex items-center gap-2'>
          <Dialog open={isCreateCategoryModalOpen} onOpenChange={() => setIsCreateCategoryModalOpen(!isCreateCategoryModalOpen)}>
            <DialogTrigger asChild>
              <Button size='sm' className='h-8 gap-1' onClick={() => {setCurrentCategory(null); setOriginalCategory(null); setIsCreateCategoryModalOpen(true);}}>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Add Category</span> 
              </Button>
            </DialogTrigger>
            <DialogContent className="border border-pink-600 text-white" style={{backgroundColor: '#fb4570'}}>
              <DialogHeader>
                <DialogTitle className="text-white">
                  {currentCategory ? 'Update Category' : 'Create Category'}
                </DialogTitle>
              </DialogHeader>
              <CategoryForm form={form} onSubmit={submitCategoryHandler} defaultValues={currentCategory} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className='overflow-x-auto'>
        <CardHeader>
          <CardTitle>Categories</CardTitle>  
        </CardHeader>

        <CardContent>
            <Table className='min-w-[600px]'>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px] sm:table-cell'><span className="sr-only">Image</span></TableHead>
                  <TableHead className='md:table-cell'>Name</TableHead>
                    <TableHead className='md:table-cell'>Created at</TableHead>
                    <TableHead className='md:table-cell'>Products</TableHead>
                    <TableHead className='sr-only'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{categories.map(category => (
                <CategoryTableRow 
                key={category.id} 
                category={category} 
                setCurrentCategory={setCurrentCategory} 
                setOriginalCategory={setOriginalCategory}
                setIsCreateCategoryModalOpen={setIsCreateCategoryModalOpen}
                deleteCategoryHandler={deleteCategoryHandler}
                />
              ))}
              </TableBody>
            </Table>
          </CardContent>
      </Card>
    </main>
  )
}


export default CategoriesPageComponent;