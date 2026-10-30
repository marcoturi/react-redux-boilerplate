export enum StorageKeys {
  settings = '@@MYAPP_SETTINGS_',
}

const LocalStorageService = (dbKey: StorageKeys) => ({
  // Values that are not valid JSON are skipped: one corrupt entry must not
  // lose the others
  getAll: (): Record<string, unknown> => {
    const entries: [string, unknown][] = [];
    for (const key of Object.keys(globalThis.localStorage)) {
      if (!key.startsWith(dbKey)) continue;
      try {
        const value = globalThis.localStorage.getItem(key) ?? 'null';
        entries.push([key.slice(dbKey.length), JSON.parse(value)]);
      } catch {
        // Skip the corrupt entry
      }
    }
    return Object.fromEntries(entries);
  },
  set: (key: string, value: unknown) => {
    globalThis.localStorage.setItem(dbKey + key, JSON.stringify(value));
  },
});

export default LocalStorageService;
