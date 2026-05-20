module.exports = {
  apps: [
    {
      name: 'electromenager-paris',
      script: '.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      env_file: '.env',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '127.0.0.1',
      },
      // Logs
      out_file: '/var/log/pm2/electromenager-out.log',
      error_file: '/var/log/pm2/electromenager-err.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      // Redémarrage automatique
      watch: false,
      max_memory_restart: '512M',
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
}
