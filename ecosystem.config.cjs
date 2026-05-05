module.exports = {
  apps: [
    {
      name: 'deshbazaar-backend',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8007
      },
      error_file: '/var/log/pm2/deshbazaar-backend-error.log',
      out_file: '/var/log/pm2/deshbazaar-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
