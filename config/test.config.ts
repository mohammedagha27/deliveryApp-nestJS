import * as dotenv from 'dotenv';
dotenv.config();

export default () => ({
  database: {
    dialect: 'mysql',
    host: 'localhost',
    port: process.env.DATABASE_PORT || 3306,
    database: process.env.TEST_DATABASE_NAME,
    username: process.env.TEST_DATABASE_USERNAME,
    password: process.env.TEST_DATABASE_PASSWORD,
  },
});
