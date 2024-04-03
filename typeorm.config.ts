import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();
export const dataSourceOptions: DataSourceOptions = {
  // TypeORM PostgreSQL DB Drivers
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  synchronize: false,
  entities: ['dist/src/entities/*.entity.js'],
  migrations: ['dist/src/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
export default dataSource;
