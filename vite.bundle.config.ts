import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          charts: ['recharts'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
          routing: ['wouter'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: true,
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@/components': resolve(__dirname, './client/src/components'),
      '@/lib': resolve(__dirname, './client/src/lib'),
      '@/hooks': resolve(__dirname, './client/src/hooks'),
      '@/pages': resolve(__dirname, './client/src/pages'),
      '@/shared': resolve(__dirname, './shared'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'wouter',
      'react-hook-form',
      '@hookform/resolvers/zod',
      'zod',
      'date-fns',
      'recharts',
    ],
  },
});