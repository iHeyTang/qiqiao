module.exports = {
  apps: [
    {
      name: "web",
      script: "./apps/web/server/index.mjs",
    },
    {
      name: "admin-server",
      script: "./apps/admin-server/dist/main.js",
    },
  ],
};
