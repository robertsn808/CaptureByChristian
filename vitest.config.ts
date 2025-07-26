import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 30000,
    // Run tests sequentially to avoid database conflicts
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      }
    },
    // Only run test files in the tests directory
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules/**', 'dist/**'],
    // Environment variables for testing
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/capture_test',
      SESSION_SECRET: 'test-session-secret',
      ADMIN_USERNAME: 'testadmin',
      ADMIN_PASSWORD: 'testpassword'
    }
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'shared'),
      '@': path.resolve(__dirname, '.'),
    }
  },
  esbuild: {
    target: 'node18'
  }
});