import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'dd2vin',
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
  },
});
