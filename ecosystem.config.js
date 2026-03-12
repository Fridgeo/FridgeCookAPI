module.exports = {
  apps: [
    {
      name: "FridgeCookAPI",
      script: "dist/src/main.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      ignore_watch: ["node_modules", "dist"],
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        ENABLE_RECIPE_WEBHOOK: "true",
        DEBUG_SEARCH: "true",
        // RECIPE_WEBHOOK_URL: "http://fridgeo.smashballoon.lan:5678/webhook/recette",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        ENABLE_RECIPE_WEBHOOK: "false",
        DEBUG_SEARCH: "false",
      }
    }
  ]
};
