import type { ReactNode } from 'react';
import { Logo } from './Logo';
import { Menu, type MenuItem } from './Menu';

type HeaderProps = {
  menuItems: MenuItem[];
  rightWidget?: ReactNode;
};

export function Header({ menuItems, rightWidget }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-background shadow-sm">
      {/* Not a <nav>: the menu renders its own navigation landmark */}
      <div className="flex w-full items-center justify-between gap-3 px-4 py-3">
        <Logo />
        <Menu menuItems={menuItems} />
        <div className="text-right">{rightWidget}</div>
      </div>
    </header>
  );
}
