const fs = require('fs');

module.exports = {
  devServer: {
    port: 8443,
    https: true,
    key: fs.readFileSync('../.cert/devcert.key'),
    cert: fs.readFileSync('../.cert/devcert.pem'),
    proxy: {
      '/api/*': {
        target: 'https://localhost:3000',
        //target: 'https://localhost:5001',
        secure: false
      }
    }
  }
};
