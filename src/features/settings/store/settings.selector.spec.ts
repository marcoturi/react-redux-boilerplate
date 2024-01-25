import { SettingsSelectors } from '.';
import { RootState } from '@/core/store/types';
import { initialStorageState } from '@/features/settings/store/settings.slice';
import { SettingsKey } from '@/features/settings/store/settings.type';

describe('Settings Selector:', () => {
  it('Should return a list of filters', () => {
    const expectedState = {
      settings: initialStorageState,
    } as RootState;
    expect(
      SettingsSelectors.getSettingByKey(expectedState)(SettingsKey.filters),
    ).toEqual(initialStorageState[SettingsKey.filters]);
  });
});
