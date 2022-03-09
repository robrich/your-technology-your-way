const { defineConfig } = require('@vue/cli-service');
const { readFileSync } = require('fs');

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: '../api/public',
  devServer: {
    host: '127.0.0.1', // because self-signed cert is only for localhost
    port: 8080,
    https: {
      key: readFileSync('../.cert/devcert.key'),
      cert: readFileSync('../.cert/devcert.pem'),
    },
    proxy: {
      '^/api/': {
        target: 'https://localhost:3000'
        //target: 'https://localhost:5001'
      }
    }
  }
});
