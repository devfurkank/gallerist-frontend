import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    proxy: {
      // Auth endpoints (no prefix)
      '/authenticate': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/register': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/refresh_token': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // API endpoints (/rest/api/*)
      '/rest': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
