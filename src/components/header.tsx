'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { CircleUser, Menu, Moon, Package2, Search, Sun } from 'lucide-react';

import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

import { createClient } from '../supabase/client';
//import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
];

export const Header = () => {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
      <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        <Link
          href='/'
          className='flex items-center gap-2 text-lg font-semibold md:text-base'
        >
          <Package2 className='h-6 w-6' />
        </Link>
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'transition-colors hover:text-foreground text-muted-foreground',
              {
                'text-foreground font-bold': pathname === href,
              }
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <nav className='grid gap-6 text-lg font-medium'>
            <Link
              href='/'
              className='flex items-center gap-2 text-lg font-semibold'
            >
              <Package2 className='h-6 w-6' />
            </Link>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn('hover:text-foreground text-muted-foreground', {
                  'text-foreground font-bold': pathname === href,
                })}
              >
                {label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className='flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <form className='ml-auto flex-1 sm:flex-initial'>
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search products...'
              className='pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]'
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='secondary' size='icon' className='rounded-full'>
              <CircleUser className='h-5 w-5' />
              <span className='sr-only'>Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className="text-white" style={{backgroundColor: '#fb4570'}}>
            <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-pink-300" />
            <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-pink-600">Logout</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-pink-300" />
            <DropdownMenuItem onClick={() => setTheme('light')} className="text-white hover:bg-pink-600">
              <Sun className='mr-2 h-4 w-4' />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')} className="text-white hover:bg-pink-600">
              <Moon className='mr-2 h-4 w-4' />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')} className="text-white hover:bg-pink-600">
              <CircleUser className='mr-2 h-4 w-4' />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};