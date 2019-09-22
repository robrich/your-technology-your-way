const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const nocache = require('nocache');

require('./async-router-patch'); // before requiring routes
const orderRouter = require('./routes/order');
const versionRouter = require('./routes/version');

const app = express();

app.use(logger('dev'));
app.use(nocache());
app.set('etag', false);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

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
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  };

  // render the error page
  res.status(err.status || 500);
  res.json(msg);
});

module.exports = app;
