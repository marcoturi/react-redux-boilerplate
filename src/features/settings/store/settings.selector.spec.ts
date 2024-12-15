import { SettingsSelectors } from '.';
import { initialStorageState } from '@/features/settings/store/settings.slice';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { RootState } from '@/shared/store/types';
import { expect, it, describe } from 'vitest';

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
