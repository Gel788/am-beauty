const path = require("node:path");

/** PM2 config for VPS — next start from repo root (Turbopack build, без standalone) */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ambeauty-cosmetica.ru";

module.exports = {
  apps: [
    {
      name: "am-beauty",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "768M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
        NEXT_PUBLIC_SITE_URL: siteUrl,
        ADMIN_DB_DIR: path.join(__dirname, ".data"),
      },
    },
  ],
};
