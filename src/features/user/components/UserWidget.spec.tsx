import { renderWithProviders } from '@/shared/store/test';
import UserWidget from '@/features/user/components/UserWidget';
import { screen, waitFor } from '@testing-library/react';

describe('UserWidget', () => {
  test('Should display the user name', async () => {
    renderWithProviders(<UserWidget />);
    await waitFor(() => {
      expect(screen.getByText(/hello /i)).toBeInTheDocument();
    });
  });
});
