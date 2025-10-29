import { createClient } from "@/src/supabase/server";
import type { QueryData } from "@supabase/supabase-js";

const supabase = await createClient();

// Query for type extraction
const ordersQuery = supabase
  .from('order')
  .select('*, order_items:order_item(* , product(*)),user(*) ')
  .order('created_at', { ascending: false });

export type OrdersWithProductsResponse = QueryData<typeof ordersQuery>;

// Alias for backward compatibility
export type OrdersWithProducts = OrdersWithProductsResponse;