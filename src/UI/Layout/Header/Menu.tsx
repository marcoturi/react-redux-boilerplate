import { Link, useLocation } from 'react-router';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/UI/Base/navigation-menu';

export type MenuItem = { label: string; href: string; testId: string };

type MenuProps = {
  menuItems: MenuItem[];
};

export function Menu({ menuItems }: MenuProps) {
  const { pathname } = useLocation();

  return (
    // No dropdown content, so no viewport
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            {/* `active` sets aria-current="page" and the active style */}
            <NavigationMenuLink
              active={pathname === item.href}
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link data-testid={item.testId} to={item.href}>
                {item.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
