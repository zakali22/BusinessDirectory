var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sessions = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var businessRouter = require('./routes/business');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());

// Express Session
app.use(session({
	secret: 'secret',
	resave: false,
	saveUnitialized: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/business', businessRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
