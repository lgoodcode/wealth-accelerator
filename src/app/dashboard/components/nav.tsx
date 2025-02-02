'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

import { financeRoutes, toolsRoutes, adminRoutes } from '@/config/routes';
import { cn } from '@/lib/utils/cn';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  href: string;
  Icon: LucideIcon;
}

const ListItem = forwardRef<React.ElementRef<'a'>, ListItemProps>(
  ({ className, title, Icon, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            href={href}
            className={cn(
              'block h-auto select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className="flex flex-row gap-3">
              <div className="h-full flex items-start">
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-semibold leading-none">{title}</div>
                <p className="text-sm leading-snug text-muted-foreground">{children}</p>
              </div>
            </div>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  isAdmin: boolean;
}

export function Nav({ className, isAdmin }: NavProps) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Finance</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {financeRoutes.map((route) =>
                route.disabled ? null : (
                  <ListItem key={route.path} title={route.name} href={route.path} Icon={route.Icon}>
                    {route.description}
                  </ListItem>
                )
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {toolsRoutes.map((route) =>
                route.disabled ? null : (
                  <ListItem key={route.path} title={route.name} href={route.path} Icon={route.Icon}>
                    {route.description}
                  </ListItem>
                )
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {isAdmin && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {adminRoutes.map((route) =>
                  route.disabled ? null : (
                    <ListItem
                      key={route.path}
                      title={route.name}
                      href={route.path}
                      Icon={route.Icon}
                    >
                      {route.description}
                    </ListItem>
                  )
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
