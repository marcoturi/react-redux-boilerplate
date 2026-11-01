import { SubscriptionFilters } from '@/features/subscriptions/store/subscription.type';
import { captureError } from '@/shared/helpers/error-tracking.service';
import { StorageKeys } from '@/shared/helpers/local-storage.service';
import { setupStore } from '@/shared/store';
import { readStoredSetting } from '@/test/storage';
import { SettingsActions, SettingsSelectors } from '.';
import { SettingsKey } from './settings.type';

vi.mock('@/shared/helpers/error-tracking.service');

describe('Settings persistence:', () => {
  test('Should save the filter and restore it in a new store', async () => {
    setupStore().dispatch(
      SettingsActions.subscriptionFilterChanged(
        SubscriptionFilters.OneTimePurchase,
      ),
    );
    expect(readStoredSetting(SettingsKey.filters)).toEqual({
      filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase,
    });

    const store = setupStore();
    await store.dispatch(SettingsActions.loadState());

    expect(SettingsSelectors.selectSubscriptionFilter(store.getState())).toBe(
      SubscriptionFilters.OneTimePurchase,
    );
  });

  test('Should keep the defaults when the saved value is corrupt', async () => {
    localStorage.setItem(
      `${StorageKeys.settings}${SettingsKey.filters}`,
      '{oops',
    );
    const store = setupStore();

    const action = await store.dispatch(SettingsActions.loadState());

    expect(action.type).toBe(SettingsActions.loadState.fulfilled.type);
    expect(SettingsSelectors.selectSubscriptionFilter(store.getState())).toBe(
      SubscriptionFilters.All,
    );
  });

  test('Should apply the filter and report the error when saving fails', () => {
    const error = new Error('QuotaExceededError');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw error;
    });
    const store = setupStore();

    store.dispatch(
      SettingsActions.subscriptionFilterChanged(
        SubscriptionFilters.OneTimePurchase,
      ),
    );

    expect(SettingsSelectors.selectSubscriptionFilter(store.getState())).toBe(
      SubscriptionFilters.OneTimePurchase,
    );
    expect(captureError).toHaveBeenCalledWith(
      error,
      'Error saving the settings to local storage',
    );
  });

  test('Should keep the defaults and report the error when storage is blocked', async () => {
    const storage = vi
      .spyOn(globalThis, 'localStorage', 'get')
      .mockImplementation(() => {
        throw new Error('SecurityError');
      });
    const store = setupStore();

    const action = await store.dispatch(SettingsActions.loadState());
    // The setup file clears localStorage after each test
    storage.mockRestore();

    expect(action.type).toBe(SettingsActions.loadState.rejected.type);
    expect(SettingsSelectors.selectSubscriptionFilter(store.getState())).toBe(
      SubscriptionFilters.All,
    );
    expect(captureError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'SecurityError' }),
      'Error loading the settings from local storage',
    );
  });
});
