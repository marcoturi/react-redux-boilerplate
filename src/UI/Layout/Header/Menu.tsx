import { Link } from 'react-router';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/UI/Base/navigation-menu';

type Props = {
  menuItems: { label: string; href: string; testId: string }[];
};

export function Menu({ menuItems }: Props) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.label}>
            <NavigationMenuLink asChild>
              <Link
                className={navigationMenuTriggerStyle()}
                data-testid={item.testId}
                to={item.href}
              >
                {item.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
