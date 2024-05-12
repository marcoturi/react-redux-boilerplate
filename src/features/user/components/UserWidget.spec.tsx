import UserWidget from '@/features/user/components/UserWidget';
import { renderWithProviders } from '@/shared/store/test';
import { screen, waitFor } from '@testing-library/react';

describe('UserWidget', () => {
  test('Should display the user name', async () => {
    renderWithProviders(<UserWidget />);
    await waitFor(() => {
      expect(screen.getByText(/hello /i)).toBeInTheDocument();
    });
  });
});
