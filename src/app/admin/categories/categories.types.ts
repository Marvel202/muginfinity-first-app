import { ProductWithCategory } from "@/src/app/admin/products/products.types";


export type Category = {
  created_at: string;
  id: number;
  name: string;
  slug: string;
  imageUrl: string;

};

export type CategoryWithProducts = {
  created_at: string;
  id: number;
  imageUrl: string;
  name: string;
  products: ProductWithCategory[];
  slug: string;
};

export type CategoriesWithProductsResponse = CategoryWithProducts[];

