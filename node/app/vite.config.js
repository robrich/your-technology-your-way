import vue from '@vitejs/plugin-vue';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export default {
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '../api/public'
  },
  server: {
    port: 8080,
    https: {
      key: readFileSync('../.cert/devcert.key'),
      cert: readFileSync('../.cert/devcert.pem'),
    },
    proxy: {
      '^/api/': {
        secure: false, // because self-signed cert
        target: 'https://localhost:3000'
        //target: 'https://localhost:5001'
      }
    }
  }
};
