import SubscriptionsPage from '@/routes/Subscriptions/SubscriptionsPage';
import { renderWithProviders } from '@/shared/store/test';
// import { userEvent } from '@vitest/browser/context';
import { page } from '@vitest/browser/context'
import { expect, it, describe, vi } from 'vitest';

describe('SubscriptionsPage', () => {
  // it('Should load page title', async () => {
  //   const screen = renderWithProviders(<SubscriptionsPage />);
  //   await expect.element(page.getByText(/subscriptions/i)).toBeVisible()
  //   expect(screen.container).toMatchSnapshot()
  // });
  it('Should load subscriptions', async () => {
     renderWithProviders(<SubscriptionsPage />);
    vi.waitFor(async () => {
      const a = page.getByTestId('subscription-item').elements();
      console.log(a);
      await expect.element(page.getByTestId('subscription-item')).toBeInTheDocument()
    })

    // expect(screen.locator('[data-testid="subscription-item"').length).toBe(3);
  });

  // it('Should handle a change in filters', async () => {
  //   const screen = renderWithProviders(<SubscriptionsPage />);
  //   const user = userEvent.setup();
  //
  //   // Filter should be present
  //   const optionSelect = screen.getByRole('combobox');
  //   expect(optionSelect).toBeInTheDocument();
  //   expect(screen.queryByText('All')).toBeInTheDocument();
  //   expect(screen.queryByText('One Time Purchase')).not.toBeInTheDocument();
  //
  //   // Options should be clickable
  //   await user.click(optionSelect);
  //   const oneTimePurchase = screen.getByRole('option', {
  //     name: 'One Time Purchase',
  //   });
  //   expect(oneTimePurchase).toBeInTheDocument();
  //   await user.click(oneTimePurchase);
  //   expect(screen.queryByText('One Time Purchase')).toBeInTheDocument();
  //   expect(screen.queryByText('All')).not.toBeInTheDocument();
  // });
});
