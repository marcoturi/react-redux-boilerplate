import { screen } from '@testing-library/react';
import { UserWidget } from '@/features/user/components/UserWidget';
import { renderWithProviders } from '@/shared/store/test';

describe('UserWidget', () => {
  test('Should display the user name', async () => {
    renderWithProviders(<UserWidget />);
    expect(await screen.findByText('Hello Marco T.')).toBeInTheDocument();
  });
});
