import { getCategoriesWithProducts } from '@/src/app/actions/categories';
import CategoryPageComponent from '@/src/app/admin/categories/page-component';


export default async function Categories() {
    // Fetch categories
   const categories = await getCategoriesWithProducts();
   
   return <CategoryPageComponent categories={categories} />
}