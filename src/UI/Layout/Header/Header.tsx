import { Logo } from './Logo';
import Menu from '@/UI/Layout/Header/Menu';

type Props = {
  rightWidget: any;
  menuItems: { label: string; href: string; testId: string }[];
};

export function Header({ rightWidget, menuItems }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full shadow">
      <nav className="flex w-full items-center justify-between gap-3 pb-3 pl-4 pr-4 pt-3">
        <Logo />
        <Menu menuItems={menuItems} />
        <div className="text-right">{rightWidget}</div>
      </nav>
    </header>
  );
}
