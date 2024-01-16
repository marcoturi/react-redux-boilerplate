export enum SettingsKey {
  test = 'test',
}

export type SettingsState = {
  [SettingsKey.test]: boolean;
};

export interface SetValuePayload {
  key: SettingsKey;
  value: any;
}

export interface RemoveValuePayload {
  key: SettingsKey;
}
