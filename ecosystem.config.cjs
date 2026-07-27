module.exports = {
  apps: [
    {
      name: "yourhomecare-web",
      cwd: "./apps/web",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      max_memory_restart: "512M",
      error_file: "../../logs/yourhomecare-error.log",
      out_file: "../../logs/yourhomecare-out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
