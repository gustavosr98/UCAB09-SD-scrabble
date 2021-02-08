export default () => ({
  api: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  jwt: {
    expirationTime: process.env.TOKEN_EXPIRATION_TIME,
    secret: process.env.TOKEN_SECRET,
  },
  database: {
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    synchronize: process.env.DATABASE_SYNCHRONIZE,
  },
});
