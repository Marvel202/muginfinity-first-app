import { getOrdersWithProducts } from "@/src/app/actions/orders";
import PageComponent from "@/src/app/admin/orders/page-component";

const Orders = async () => {
  const ordersWithProducts = await getOrdersWithProducts();
  if (!ordersWithProducts) {
    return (<div className="text-center font-bold text-2xl">No Orders Found.</div>);
  }
  console.log('ordersWithProducts:', ordersWithProducts);


  return <div><PageComponent ordersWithProducts={ordersWithProducts} /></div>;

}

export default Orders;

