import { render, screen } from '@testing-library/react';
import { ErrorFallback } from '.';

describe('ErrorFallback', () => {
  test('Should show an alert and a reload button', () => {
    render(<ErrorFallback />);
    expect(screen.getByRole('alert')).toMatchTextContent(
      /something went wrong/i,
    );
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
  });
});
