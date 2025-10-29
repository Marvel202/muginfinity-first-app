'use server';

import  {createClient } from '@/src/supabase/server';
import { sendNotification } from '@/src/app/actions/notifications';
import { revalidatePath } from 'next/cache';

export const getOrdersWithProducts = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('order')
    .select('*, order_items:order_item(* , product(*)),user(*) ')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching orders with products:', error);
    return null;
  }
  return data;
}
export const updateOrderStatus = async (orderId: number, status: string) => {
  const supabase = await createClient();
  
  // First, get the order to find the customer's user ID
  const { data: order, error: fetchError } = await supabase
    .from('order')
    .select('user')
    .eq('id', orderId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  // Update the order status
  const { error } = await supabase
    .from('order')
    .update({ status })
    .eq('id', orderId);

  if (error) throw new Error(error.message);

  // Send notification to the CUSTOMER (not the admin)
  const customerId = order.user;
  console.log('📦 Order status updated. Sending notification to customer:', customerId);
  
  await sendNotification(customerId, status + ' 🚀');

  revalidatePath('/admin/orders');
};

export const getMonthlyOrders = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('order').select('created_at');

  if (error) throw new Error(error.message);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const ordersByMonth = data.reduce(
    (acc: Record<string, number>, order: { created_at: string }) => {
      const date = new Date(order.created_at);
      const month = monthNames[date.getUTCMonth()]; // Get the month name

      // Increment the count for this month
      if (!acc[month]) acc[month] = 0;
      acc[month]++;

      return acc;
    },
    {}
  );

  return Object.keys(ordersByMonth).map(month => ({
    name: month,
    orders: ordersByMonth[month],
  }));
};