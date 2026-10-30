import { initialStorageState } from '@/features/settings/store/settings.slice';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { setupStore } from '@/shared/store/test';
import { SettingsSelectors } from '.';

describe('Settings Selector:', () => {
  it('Should return a list of filters', () => {
    const expectedState = setupStore().getState();
    expect(
      SettingsSelectors.selectSettingByKey(expectedState, SettingsKey.filters),
    ).toEqual(initialStorageState[SettingsKey.filters]);
  });
});
