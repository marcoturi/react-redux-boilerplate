import { render, screen } from '@testing-library/react';
import { ErrorFallback } from '@/UI/Elements/ErrorFallback';

describe('ErrorFallback', () => {
  test('Should show an alert and a reload button', () => {
    render(<ErrorFallback />);
    expect(screen.getByRole('alert')).toHaveTextContent(
      /something went wrong/i,
    );
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
  });
});
