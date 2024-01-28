import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/UI/Elements/Navigation';

type Props = {
  menuItems: { label: string; href: string; testId: string }[];
};

function Menu({ menuItems }: Props) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.label}>
            <NavigationMenuLink
              data-testid={item.testId}
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
