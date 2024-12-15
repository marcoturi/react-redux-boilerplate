import HomePage from '@/routes/Home/HomePage';
import { renderWithProviders } from '@/shared/store/test';
import { expect, it, describe } from 'vitest';

describe('HomePage', () => {
  it('Should load', () => {
    const screen = renderWithProviders(<HomePage />);
    const text = screen.getByText(
      /lorem ipsum dolor sit amet, consectetuer adipiscing elit./i,
    );
    expect(text).toBeInTheDocument();
  });
});
