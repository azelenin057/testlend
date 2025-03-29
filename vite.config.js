import { defineConfig } from 'vite';

export default defineConfig({
  root: './', // Корневая директория проекта
  build: {
    outDir: 'dist', // Папка для сборки
    emptyOutDir: true, // Очищать папку перед сборкой
  },
  server: {
    open: true, // Автоматически открывать браузер при запуске
  },
});