import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
    root: './src',
    publicDir: '../public',
    base: '/',
    plugins: [glsl()],
    build: {
      outDir: '../dist',
      rollupOptions: {
        input: [
          path.resolve(__dirname, './src/index.html'),
          path.resolve(__dirname, './src/sketch01/index.html'),
          path.resolve(__dirname, './src/sketch02/index.html'),
          path.resolve(__dirname, './src/sketch03/index.html'),
          path.resolve(__dirname, './src/sketch04/index.html'),
        ],
      },
    },
    server: {
      host: true,
    },
  };
});
