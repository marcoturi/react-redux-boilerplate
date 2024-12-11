import { factory, primaryKey } from '@mswjs/data';

const models = {
  user: {
    id: primaryKey(String),
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    createdAt: Number,
  },
};

export const db = factory(models);

export type Model = keyof typeof db;

export const loadDb = () =>
  Object.assign(JSON.parse(globalThis.localStorage.getItem('msw-db') ?? '{}'));

export const persistDb = (model: Model) => {
  if (process.env.NODE_ENV === 'test') return;
  const data = loadDb();
  data[model] = (db[model] as any).getAll();
  globalThis.localStorage.setItem('msw-db', JSON.stringify(data));
};

export const initializeDb = () => {
  const database = loadDb();

  for (const [key, model] of Object.entries(db)) {
    const dataEntries = database[key];
    if (dataEntries) {
      // eslint-disable-next-line unicorn/no-array-for-each
      dataEntries?.forEach((entry: Record<string, any>) => {
        model.create(entry);
      });
    }
  }
};

export const resetDb = () => {
  globalThis.localStorage.clear();
};

initializeDb();
