/** PM2 config for VPS without Docker */
module.exports = {
  apps: [
    {
      name: "am-beauty",
      script: ".next/standalone/server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
        NEXT_PUBLIC_SITE_URL: "https://your-domain.ru",
      },
    },
  ],
};
