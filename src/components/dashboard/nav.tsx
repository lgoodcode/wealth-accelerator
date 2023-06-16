import { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { generalRoutes } from '@/routes/general';
import { financeRoutes } from '@/routes/finance';
import { adminRoutes } from '@/routes/admin';

interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  Icon: LucideIcon;
}

const ListItem = forwardRef<React.ElementRef<'a'>, ListItemProps>(
  ({ className, title, Icon, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
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
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

export function Nav({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {/* <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <ListItem href="/docs" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}

        <NavigationMenuItem>
          <NavigationMenuTrigger>General</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {generalRoutes.map((route) => (
                <ListItem key={route.path} title={route.name} href={route.path} Icon={route.Icon}>
                  {route.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Finance</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {financeRoutes.map((route) => (
                <ListItem key={route.path} title={route.name} href={route.path} Icon={route.Icon}>
                  {route.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {adminRoutes.map((route) => (
                <ListItem key={route.path} title={route.name} href={route.path} Icon={route.Icon}>
                  {route.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
