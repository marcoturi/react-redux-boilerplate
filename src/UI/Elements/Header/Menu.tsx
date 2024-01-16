import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/UI/Elements/Navigation/NavigationMenu';
import { navigationMenuTriggerStyle } from '@/UI/Elements/Navigation/NavigationMenuStyle';

type Props = {
  menuItems: any;
};

function Menu({ menuItems }: Props) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.label}>
            <NavigationMenuLink
              href={item.href}
              className={navigationMenuTriggerStyle()}
            >
              {item.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Menu;
