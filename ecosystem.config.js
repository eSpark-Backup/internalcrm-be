module.exports = {
  apps: [
    {
      script: 'dist/src/main.js',
      name: 'internalcrm-backend',
      instances: '1',
      exec_mode: 'cluster',
      env_development: {
        PORT: process.env.PORT,
        MYSQL_HOST: process.env.MYSQL_HOST,
        MYSQL_PORT: process.env.MYSQL_PORT,
        MYSQL_USERNAME: process.env.MYSQL_USERNAME,
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
        MYSQL_DB: process.env.MYSQL_DB,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRE_NORMAL: process.env.JWT_EXPIRE_NORMAL,
        JWT_EXPIRE_REMEMBER_ME: process.env.JWT_EXPIRE_REMEMBER_ME,
        MAX_ASSET_UPLOAD_SIZE: process.env.MAX_ASSET_UPLOAD_SIZE,
        B2_APPLICATION_KEY_ID: process.env.B2_APPLICATION_KEY_ID,
        B2_APPLICATION_KEY: process.env.B2_APPLICATION_KEY,
        BUCKET_ID: process.env.BUCKET_ID,
        BUCKET_NAME: process.env.BUCKET_NAME,
        END_POINT: process.env.END_POINT,
        REGION: process.env.REGION,
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
