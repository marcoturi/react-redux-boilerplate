export enum StorageKeys {
  settings = '@@MYAPP_SETTINGS_',
}

const LocalStorageService = (dbKey: StorageKeys) => ({
  getAll: () =>
    Object.keys(localStorage)
      .filter((key) => key.startsWith(dbKey))
      .reduce((obj, k) => {
        const key = k.replace(dbKey, '');
        return {
          ...obj,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          [key]: JSON.parse(globalThis.localStorage.getItem(k)!),
        };
      }, {}),
  get: (key: string) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    JSON.parse(globalThis.localStorage.getItem(dbKey + key)!),
  set: (key: string, value: any) => {
    globalThis.localStorage.setItem(dbKey + key, JSON.stringify(value));
  },
  clear: (key: string) => {
    globalThis.localStorage.removeItem(key);
  },
});

export default LocalStorageService;
