'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart2,
  Contact2,
  GaugeCircle,
  LayoutGrid,
  LogOut,
  MessagesSquare,
  Settings,
  ChevronLeft,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import logo from '@/../public/assets/logo.png';
import { signOut, useSession } from 'next-auth/react'; // Import useSession

const navItems = [
  {
    title: 'Contacts',
    icon: Contact2,
    href: '/contacts',
  },
  {
    title: 'Customers',
    icon: Users,
    href: '/customers',
  },
  {
    title: 'Churn',
    icon: BarChart2,
    href: '/churn',
  },
  {
    title: 'Usage',
    icon: GaugeCircle,
    href: '/usage',
  },
  {
    title: 'Engagement',
    icon: MessagesSquare,
    href: '/engagement',
  },
  {
    title: 'Requests',
    icon: LayoutGrid,
    href: '/requests',
  },
  {
    title: 'Tools',
    icon: Settings,
    href: '/tools',
  },
];

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession(); // Use useSession hook

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  }, []);

  // Loading state handling
  if (status === 'loading') {
    return (
      <aside className="flex h-screen sticky top-0 flex-col bg-[rgb(75,75,75)] text-white transition-all duration-300 w-[240px]">
        <div className="flex h-14 items-center px-4 font-semibold justify-center">
          Loading Session...
        </div>
      </aside>
    );
  }

  const userName = session?.user
    ? `${session.user.firstName} ${session.user.lastName}`
    : 'ADMIN';
  const userImage = session?.user?.image; // Get user image if available

  return (
    <aside
      className={cn(
        'flex h-screen sticky top-0 flex-col bg-[rgb(75,75,75)] text-white transition-all duration-300',
        isCollapsed ? 'w-[70px]' : 'w-[240px]'
      )}
    >
      <div className="flex h-14 items-center px-4 font-semibold justify-between">
        {!isCollapsed && (
          <Link href="/" className="flex text-2xl items-center gap-2">
            <img src={logo.src} alt="" />
          </Link>
        )}
        {
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-2 h-8 w-8 text-white hover:bg-[rgb(50,50,50)] flex items-center justify-center"
          >
            <ChevronLeft
              className={cn(
                'h-6 w-6  transition-transform',
                isCollapsed && 'rotate-180'
              )}
            />
          </Button>
        }
      </div>

      <div className={cn('px-4 py-3', isCollapsed && 'flex justify-center')}>
        <div className="flex items-center gap-3">
          {userImage ? ( // Conditionally render user image or placeholder
            <img
              src={userImage}
              alt={userName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {userName.charAt(0).toUpperCase()}{' '}
              {/* First letter as placeholder if no image */}
            </div>
          )}

          {!isCollapsed && (
            <div className="flex flex-col">
              <p className="text-sm font-bold">{userName}</p>
              {/* You can display user role or other info here if available in session */}
            </div>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="flex justify-center">
          <Separator className="my-2 w-52 bg-white" />
        </div>
      )}

      <div className="flex-1 px-2 py-2">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-[rgb(50,50,50)]',
                pathname === item.href
                  ? 'bg-primary text-white hover:bg-primary'
                  : 'text-white',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.title : ''}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && item.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-2 text-zinc-400 hover:bg-zinc-800 hover:text-white',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? 'Logout Account' : undefined}
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && 'Logout Account'}
        </Button>
      </div>
    </aside>
  );
}
