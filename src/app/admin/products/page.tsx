import { getCategoriesWithProducts } from '@/src/app/actions/categories';

import ProductPageComponent from "@/src/app/admin/products/page-component";
import { getProductsWithCategories } from '../../actions/products';

export default async function Products() {
    const categories = await getCategoriesWithProducts();
    const productsWithCategories = await getProductsWithCategories();
    return <ProductPageComponent categories={categories}
    productsWithCategories={productsWithCategories} />;

}
