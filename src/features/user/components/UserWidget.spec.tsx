import UserWidget from '@/features/user/components/UserWidget';
import { renderWithProviders } from '@/shared/store/test';
import { expect, it, describe } from 'vitest';

describe('UserWidget', () => {
  it('Should display the user name', async () => {
    const screen = renderWithProviders(<UserWidget />);
    expect(screen.getByText(/hello /i)).toBeInTheDocument();
  });
});
