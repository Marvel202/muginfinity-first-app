'use server';

import { createClient } from '../../supabase/server';

export const authenticate = async (email: string, password: string) => {
  const supabase = await createClient();
  try {
    console.log('🔐 Attempting to authenticate:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('❌ AUTHENTICATION ERROR', error);
      throw error;
    }
    
    console.log('✅ Authentication successful for:', email);
    console.log('👤 User ID:', data.user?.id);
  } catch (error) {
    console.log('❌ AUTHENTICATION ERROR', error);
    throw error;
  }
};

export const getLatestUsers = async () => {
  const supabase = await createClient();
  
  // Calculate date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data, error } = await supabase
    .from('users')
    .select('id, email, created_at, orders:order(count)')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Error fetching latest users: ${error.message}`);

  return data.map(
    (user: { id: string; email: string; created_at: string | null; orders: {count: number}[] }) => ({
      id: user.id,
      email: user.email,
      date: user.created_at,
      totalPurchases: user.orders[0]?.count || 0,
    })
  );
};