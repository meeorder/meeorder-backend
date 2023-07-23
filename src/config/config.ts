export default () => ({
    db: process.env.DB ?? "mongodb://localhost/nest"
  });