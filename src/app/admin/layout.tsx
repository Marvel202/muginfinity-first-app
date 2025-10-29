import { createClient } from "@/src/supabase/server";
import { redirect } from "next/navigation";
import { ADMIN } from "@/src/constants/constants";
import { Header } from "@/src/components/header";
import { Footer } from "@/src/components/footer";

export default async function AdminLayout({children}: Readonly<{children: React.ReactNode}>) {
  const supabase = await createClient();
  
    const { data: authData } = await supabase.auth.getUser();
  
    if (authData?.user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();
  
      if (error || !data) {
        console.log('❌ Error fetching user data', error);
        redirect('/auth');
        return;
      }
  
      console.log('👤 User data:', data);
      console.log('🔍 User type from DB:', data.type);
      console.log('🔍 ADMIN constant:', ADMIN);
      console.log('🔍 Type comparison:', data.type, '!==', ADMIN, '=', data.type !== ADMIN);
  
      if (data.type !== ADMIN) {
        console.log('⛔ Access denied: User type does not match ADMIN');
        redirect('/');
        return;
      }
      
      console.log('✅ Admin access granted');
    } else {
      redirect('/auth');
      return;
    }
    
    return (
       <div>
          <Header />

          <main className="min-h-[calc(100svh-128px)] py-3"> {children}</main>
         <Footer />
       </div>
    );
}