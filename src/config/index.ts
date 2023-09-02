export enum Config {
  PORT = 'PORT',
  MONGO_URI = 'MONGO_URI',
  NODE_ENV = 'NODE_ENV',
  MONGO_DB_NAME = 'MONGO_DB_NAME',
  BASE_URL = 'BASE_URL',
  MEEORDER_PUBLIC_KEY = 'MEEORDER_PUBLIC_KEY',
  MEEORDER_PRIVATE_KEY = 'MEEORDER_PRIVATE_KEY',
}

export const configuration = () => {
  const DEFAULT_PORT = 3000;
  const DEFAULT_MONGO_DB = 'meeorder';
  const DEFAULT_BASE_URL = 'http://localhost:3000';
  return {
    [Config.PORT]: +(process.env.PORT ?? DEFAULT_PORT),
    [Config.MONGO_URI]: process.env.MONGO_URI,
    [Config.NODE_ENV]: process.env.NODE_ENV,
    [Config.MONGO_DB_NAME]: process.env.MONGO_DB_NAME ?? DEFAULT_MONGO_DB,
    [Config.BASE_URL]: process.env.BASE_URL ?? DEFAULT_BASE_URL,
    [Config.MEEORDER_PUBLIC_KEY]: process.env.MEEORDER_PUBLIC_KEY,
    [Config.MEEORDER_PRIVATE_KEY]: process.env.MEEORDER_PRIVATE_KEY,
  };
};
