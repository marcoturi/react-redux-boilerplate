import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import HomePage from './HomePage';

describe('HomePage', () => {
  test('Should load', () => {
    renderWithProviders(<HomePage />);
    const text = screen.getByText(
      /lorem ipsum dolor sit amet, consectetuer adipiscing elit./i,
    );
    expect(text).toBeInTheDocument();
  });
});
