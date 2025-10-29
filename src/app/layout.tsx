import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "../providers/theme-provider";
import { Toaster } from "./../components/ui/sonner";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "i-shop-admin",
  description: "React Native Shop Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
   <html lang="en" suppressHydrationWarning>
     <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <main>{children}</main>
          <Toaster richColors />
          </ThemeProvider>
     </body>
   </html>
  );
}
