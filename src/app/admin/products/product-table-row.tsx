import { Dispatch, SetStateAction } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/src/components/ui/button';
import { TableRow, TableCell } from '@/src/components/ui/table';
import { ProductWithCategory } from '@/src/app/admin/products/products.types';
import { CreateOrUpdateProductSchema } from '@/src/app/admin/products/schema';

type Props = {
  product: ProductWithCategory;
  setIsProductModalOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentProduct: Dispatch<
    SetStateAction<CreateOrUpdateProductSchema | null>
  >;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const ProductTableRow = ({
  product,
  setIsProductModalOpen,
  setCurrentProduct,
  setIsDeleteModalOpen,
}: Props) => {
  const handleEditClick = () => {
    setCurrentProduct({
      title: product.title,
      category: product.category.id.toString(),
      price: product.price ? (product.price / 100).toFixed(2) : '',
      maxQuantity: product.maxQuantity.toString(),
      heroImage: undefined, // Will be handled in the form
      images: [],
      slug: product.slug,
      intent: 'update',
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteClick = () => {
    setCurrentProduct({
      title: product.title,
      category: product.category.id.toString(),
      price: product.price ? (product.price / 100).toFixed(2) : '',
      maxQuantity: product.maxQuantity.toString(),
      heroImage: undefined,
      images: [],
      slug: product.slug,
      intent: 'update',
    });
    setIsDeleteModalOpen(true);
  };

  return (
    <TableRow key={product.id}>
      <TableCell>{product.title}</TableCell>
      <TableCell>{product.category.name}</TableCell>
      <TableCell>${(Math.round(product.price) / 100).toFixed(2)}</TableCell>
      <TableCell>{product.maxQuantity}</TableCell>
      <TableCell>
        {product.heroImage && (
          <Image
            width={40}
            height={40}
            src={product.heroImage}
            alt='Hero'
            className='w-10 h-10 object-cover'
          />
        )}
      </TableCell>
      <TableCell>
        {product.imageUrl && product.imageUrl.length > 0 ? (
          product.imageUrl.map((url, index) => (
            <Image
              width={40}
              height={40}
              key={index}
              src={url}
              alt={`Product ${index + 1}`}
              className='w-10 h-10 object-cover inline-block mr-1'
            />
          ))
        ) : (
          <span className="text-gray-500">No images</span>
        )}
      </TableCell>
         <TableCell>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleEditClick}
        >
          <Pencil className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleDeleteClick}
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </TableCell>
    </TableRow>
  );
};