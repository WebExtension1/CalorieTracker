import sql from 'mssql';

export interface IDBSettings {
  connectionParams: {
    server: string;
    user: string;
    password: string;
    database: string;
    port: number;
  };
}

export const GetDBSettings = (): IDBSettings => {
  const host = process.env.DB_HOST!;
  const port = process.env.DB_PORT || 1433;
  const user = process.env.DB_USERNAME!;
  const password = process.env.DB_PASSWORD!;
  const database = process.env.DB_DATABASE!;

  const connectionParams = {
    server: host,
    user: user,
    password: password,
    database: database,
    port: parseInt(port.toString()),
  };

  return {
    connectionParams
  };
};
