import { screen } from '@testing-library/react';
import HomePage from '@/routes/Home/HomePage';
import { renderWithProviders } from '@/shared/store/test';

describe('HomePage', () => {
  test('Should load', () => {
    renderWithProviders(<HomePage />);
    const text = screen.getByText(
      /lorem ipsum dolor sit amet, consectetuer adipiscing elit./i,
    );
    expect(text).toBeInTheDocument();
  });
});
