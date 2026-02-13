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

export type Model = keyof typeof models;

export const loadDb = () =>
  Object.assign(JSON.parse(globalThis.localStorage.getItem('msw-db') ?? '{}'));

export const persistDb = (model: Model) => {
  if (import.meta.env.MODE === 'test') return;
  const data = loadDb();
  data[model] = db[model].getAll();
  globalThis.localStorage.setItem('msw-db', JSON.stringify(data));
};

export const initializeDb = () => {
  const database = loadDb();

  for (const key of Object.keys(db) as Model[]) {
    const dataEntries = database[key];
    if (dataEntries) {
      for (const entry of dataEntries) {
        db[key].create(entry);
      }
    }
  }
};

export const resetDb = () => {
  globalThis.localStorage.clear();
};

initializeDb();
