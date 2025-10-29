import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';

import { TableCell, TableRow } from '@/src/components/ui/table';
import { CreateCategorySchema } from '@/src/app/admin/categories/create-category.schema';
import { CategoryWithProducts } from '@/src/app/admin/categories/categories.types';

export const CategoryTableRow = ({
  category,
  setCurrentCategory,
  setOriginalCategory,
  setIsCreateCategoryModalOpen,
  deleteCategoryHandler,
}: {
  category: CategoryWithProducts;
  setCurrentCategory: (category: CreateCategorySchema | null) => void;
  setOriginalCategory: (category: CategoryWithProducts | null) => void;
  setIsCreateCategoryModalOpen: (isOpen: boolean) => void;
  deleteCategoryHandler: (id: number) => Promise<void>;
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditClick = (category: CategoryWithProducts) => {
    setCurrentCategory({
      name: category.name,
      image: undefined, // Make image optional for updates
      intent: 'update',
      slug: category.slug,
    });
    setOriginalCategory(category); // Store original category data
    setIsCreateCategoryModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCategoryHandler(category.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className='sm:table-cell'>
          <Image
            alt='Product image'
            className='aspect-square rounded-md object-cover'
            height='64'
            src={category.imageUrl}
            width='64'
          />
        </TableCell>
        <TableCell className='font-medium'>{category.name}</TableCell>
        <TableCell className='md:table-cell'>
          {format(new Date(category.created_at), 'yyyy-MM-dd')}
        </TableCell>
        <TableCell className='md:table-cell'>
          {category.products && category.products.length > 0 ? (
            <Dialog>
              <DialogTrigger>
                {category.products
                  .slice(0, 2)
                  .map(product => product.title)
                  .join(', ')}
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className='sr-only'>
                  Category product list
                </DialogTitle>
                <h2>Products</h2>
                <ScrollArea className='h-[400px] rounded-md p-4'>
                  {category.products.map(product => (
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <Card className='cursor-pointer'>
                        <div className='grid grid-cols-[100px,1fr] items-center gap-4'>
                          <Image
                            alt='Product image'
                            className='aspect-square rounded-md object-cover'
                            height='100'
                            src={product.heroImage}
                            width='100'
                          />
                          <div className='flex flex-col space-y-1'>
                            <h3 className='font-medium leading-none'>
                              {product.title}
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                              {product.maxQuantity} in stock
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ) : (
            'No products linked to this category'
          )}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='ghost'>
                <MoreHorizontal className='h-4 w-4' />
                <span className='sr-only'>Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px] text-white' style={{backgroundColor: '#fb4570'}}>
              <DropdownMenuLabel className="text-white">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white" />
              <DropdownMenuItem 
                onClick={() => handleEditClick(category)} 
                className="text-white hover:bg-white/20 hover:backdrop-blur-md hover:border hover:border-white/30 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)} 
                className="text-white hover:bg-white/20 hover:backdrop-blur-md hover:border hover:border-white/30 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(!isDeleteDialogOpen)}
      >
        <DialogContent style={{backgroundColor: '#fb4570'}} className="text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Are you absolutely sure?</DialogTitle>
            <DialogDescription className="text-white">
              This action cannot be undone. This will permanently delete this
              category.
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-end gap-4'>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-white text-gray-900 border-0 hover:bg-gray-100 shadow-none"
              style={{ border: 'none', boxShadow: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              variant='destructive' 
              onClick={handleDelete}
              className="bg-white/20 text-white border border-white/30 backdrop-blur-md hover:bg-white/30 hover:border-white/40 transition-all duration-200 shadow-lg"
            >
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};