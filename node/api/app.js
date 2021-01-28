import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';
import nocache from 'nocache';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import orderRouter from './routes/order.js';
import versionRouter from './routes/version.js';

const app = express();

app.use(logger('dev'));
app.use(nocache());
app.set('etag', false);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, 'public')));

app.use('/api/order', orderRouter);
app.use('/api/version', versionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler has 4 parameters:
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  const msg = {
    message: err?.message,
    error: req.app.get('env') === 'development' ? err : {}
  };
  console.log(`error at ${req.url}`, {err});

  // render the error page
  res.status(err?.status || 500);
  res.json(msg);
});

export default app;
