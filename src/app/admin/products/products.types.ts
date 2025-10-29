import { Category } from "@/src/app/admin/categories/categories.types";

export type ProductWithCategory = {
  category: Category
  id: number;
  imageUrl: string[];
  maxQuantity: number;
  price: number;
  heroImage: string;
  slug: string;
  title: string;
}

export type ProductsWithCategoriesResponse = ProductWithCategory[];

export type UpdateProductSchema = {
  category: number;
  heroImage?: string;
  imageUrl?: string[];
  images?: string[]; // Add images as alias for imageUrl
  maxQuantity: number;
  price: number;
  slug: string; 
  title: string;
}