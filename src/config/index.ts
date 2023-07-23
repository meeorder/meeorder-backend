export enum Config {
  PORT = 'PORT',
  MONGO_URI = 'MONGO_URI',
  NODE_ENV = 'NODE_ENV',
}

export const configuration = () => {
  return {
    [Config.PORT]: +(process.env.PORT ?? 3000),
    [Config.MONGO_URI]: process.env.MONGO_URI,
    [Config.NODE_ENV]: process.env.NODE_ENV,
  };
};
