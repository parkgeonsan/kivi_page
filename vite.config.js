import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        product1: resolve(__dirname, 'product-1.html'),
        product2: resolve(__dirname, 'product-2.html'),
        product3: resolve(__dirname, 'product-3.html'),
        product4: resolve(__dirname, 'product-4.html'),
        product5: resolve(__dirname, 'product-5.html'),
      },
    },
  },
});
