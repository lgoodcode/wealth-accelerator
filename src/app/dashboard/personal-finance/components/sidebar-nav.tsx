'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import type { SidebarNavItem } from '../layout';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: SidebarNavItem[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex flex-col md:flex-row lg:flex-col lg:space-x-0 lg:space-y-3 md:space-x-2',
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.relativePath}
          href={pathname + item.relativePath}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.relativePath
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start',
            'h-auto'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
