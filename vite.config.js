import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'react-icons'],
          forms: ['react-hook-form'],
          utils: ['date-fns', 'uuid'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'framer-motion', 
      'react-icons/fi',
      '@supabase/supabase-js'
    ]
  },
  server: {
    port: 3000,
    host: true
  }
});