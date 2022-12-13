import * as dotenv from 'dotenv';
dotenv.config();

export default () => ({
  database: {
    dialect: 'mysql',
    host: 'localhost',
    port: process.env.DATABASE_PORT || 3306,
    database: process.env.DEV_DATABASE_NAME,
    username: process.env.DEV_DATABASE_USERNAME,
    password: process.env.DEV_DATABASE_PASSWORD,
  },
});
