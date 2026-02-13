export enum StorageKeys {
  settings = '@@MYAPP_SETTINGS_',
}

const LocalStorageService = (dbKey: StorageKeys) => ({
  getAll: () =>
    Object.fromEntries(
      Object.keys(localStorage)
        .filter((key) => key.startsWith(dbKey))
        .map((k) => [
          k.replace(dbKey, ''),
          JSON.parse(globalThis.localStorage.getItem(k) ?? 'null'),
        ]),
    ),
  get: (key: string) =>
    JSON.parse(globalThis.localStorage.getItem(dbKey + key) ?? 'null'),
  set: (key: string, value: any) => {
    globalThis.localStorage.setItem(dbKey + key, JSON.stringify(value));
  },
  clear: (key: string) => {
    globalThis.localStorage.removeItem(key);
  },
});

export default LocalStorageService;
