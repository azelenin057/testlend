import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
        thankYou: './thank-you.html',
      },
    },
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'https://ecohealth-crm.voiptime.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});