const express = require('express');
const http = require('http');

/*
 * This patches express's router to correctly handle errors in async methods
 */

patchRouter();

function patchRouter() {
  express.__orig_Router = express.__orig_Router || express.Router;
  express.Router = function () {
    const router = express.__orig_Router();
    http.METHODS.forEach(method => {
      patchit(router, method.toLowerCase());
    })
    patchit(router, 'use');
    patchit(router, 'all');
    patchit(router, 'param');
    return router;
  };
}

function patchit(router, method) {
  if (!router[method]) {
    return;
  }
  const origMethod = router[method];
  router['__orig_'+method] = origMethod;
  router[method] = function (path, ...fns) {
    const wrapped = fns.map(wrapit);
    origMethod.call(router, path, ...wrapped);
  };
}

function wrapit(func) {
  return function(req, res, next) {
    Promise.resolve(func(req, res, next)).catch(next);
  };
}
