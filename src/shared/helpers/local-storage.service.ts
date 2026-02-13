export enum StorageKeys {
  settings = '@@MYAPP_SETTINGS_',
}

const LocalStorageService = (dbKey: StorageKeys) => ({
  getAll: (): Record<string, unknown> =>
    Object.fromEntries(
      Object.keys(localStorage)
        .filter((key) => key.startsWith(dbKey))
        .map((k) => [
          k.replace(dbKey, ''),
          JSON.parse(globalThis.localStorage.getItem(k) ?? 'null'),
        ]),
    ),
  get: (key: string): unknown =>
    JSON.parse(globalThis.localStorage.getItem(dbKey + key) ?? 'null'),
  set: (key: string, value: unknown) => {
    globalThis.localStorage.setItem(dbKey + key, JSON.stringify(value));
  },
  clear: (key: string) => {
    globalThis.localStorage.removeItem(dbKey + key);
  },
});

export default LocalStorageService;
