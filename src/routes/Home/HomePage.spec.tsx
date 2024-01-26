import { renderWithProviders } from '@/core/store/test';
import HomePage from '@/routes/Home/HomePage';
import { screen } from '@testing-library/react';

describe('HomePage', () => {
  test('Should load', async () => {
    renderWithProviders(<HomePage />);
    const text = screen.getByText(
      /Lorem ipsum dolor sit amet, consectetuer adipiscing elit./i,
    );
    expect(text).toBeInTheDocument();
  });
});
