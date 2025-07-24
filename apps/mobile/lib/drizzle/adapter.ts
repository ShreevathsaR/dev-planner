import SQLite from 'react-native-sqlite-storage';
import { drizzle } from 'drizzle-orm/sqlite-proxy';
import { messages } from './schema';

SQLite.enablePromise(false);

const nativeDb = SQLite.openDatabase(
  { name: 'app.db', location: 'default' },
  () => {
    console.log("SQLite DB opened");
  },
  (error) => {
    console.error("Failed to open DB", error);
  }
);

export const drizzleDb = drizzle(
  async (sql) => {
    return new Promise((resolve, reject) => {
      nativeDb.transaction((tx) => {
        tx.executeSql(
          sql,
          [],
          (_, result) => {
            const rows = [];
            for (let i = 0; i < result.rows.length; i++) {
              rows.push(result.rows.item(i));
            }
            resolve({ rows });
          },
          (_, error) => reject(error)
        );
      });
    });
  },
  {
    schema: { messages },
  }
);

