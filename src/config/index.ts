export enum Config {
  PORT = 'PORT',
  MONGO_URI = 'MONGO_URI',
  NODE_ENV = 'NODE_ENV',
  MONGO_DB_NAME = 'MONGO_DB_NAME',
}

export const configuration = () => {
  const DEFAULT_PORT = 3000;
  const DEFAULT_MONGO_DB = 'meeorder';
  return {
    [Config.PORT]: +(process.env.PORT ?? DEFAULT_PORT),
    [Config.MONGO_URI]: process.env.MONGO_URI,
    [Config.NODE_ENV]: process.env.NODE_ENV,
    [Config.MONGO_DB_NAME]: process.env.MONGO_DB_NAME ?? DEFAULT_MONGO_DB,
  };
};
