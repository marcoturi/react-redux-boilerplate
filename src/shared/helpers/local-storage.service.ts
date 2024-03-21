export enum StorageKeys {
  settings = '@@MYAPP_SETTINGS_',
}

const LocalStorageService = (dbKey: StorageKeys) => ({
  getAll: () =>
    Object.keys(localStorage)
      .filter((key) => key.startsWith(dbKey))
      .reduce((obj, k) => {
        const key = k.replace(dbKey, '');
        return { ...obj, [key]: JSON.parse(window.localStorage.getItem(k)!) };
      }, {}),
  get: (key: string) => JSON.parse(window.localStorage.getItem(dbKey + key)!),
  set: (key: string, value: any) => {
    window.localStorage.setItem(dbKey + key, JSON.stringify(value));
  },
  clear: (key: string) => {
    window.localStorage.removeItem(key);
  },
});

export default LocalStorageService;
