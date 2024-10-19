/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    includeSource: ['**/*.ts'],
    globals: true,
    coverage: {
      // you can include other reporters, but 'json-summary' is required, json is recommended
      reporter: ['text', 'json-summary', 'json'],
      // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
      reportOnFailure: true,
      // target is only backend files
      include: ['**/backend/**'],
      // removed no test files
      exclude: ['**/schema/**'],
      // set limit ratio
      // thresholds: {
      //   lines: 60,
      //   branches: 60,
      //   functions: 60,
      //   statements: 60,
      // },
    },
  },
  resolve: {
    alias: {
      'backend/': __dirname + '/packages/backend/src/',
      'src/': __dirname + '/packages/frontend/src/',
    },
  },
});
