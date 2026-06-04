import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'dd2vin',
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
