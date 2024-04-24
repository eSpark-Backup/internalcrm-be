module.exports = {
  apps: [
    {
      script: 'dist/src/main.js',
      name: 'internalcrm-backend',
      instances: '1',
      exec_mode: 'cluster',
      env_development: {
        PORT: 5000,
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
