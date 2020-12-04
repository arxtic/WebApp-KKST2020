var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken')

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/auth');
var userRouter = require('./routes/user')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const unauthorized = {
  status : 401,
  message : "Back to your lane!!"
}

const isAuth = (req, res, next) => {
  if (!req.cookies['x-auth-token']) {
      res.json(unauthorized)
      return
  }
  const auth = req.cookies['x-auth-token']
  const token  = auth.split(" ")

  if (token) {
    const creds = jwt.decode(token[1])
    req.creds = creds
    next()
  }
}

app.use('/', indexRouter);
app.use('/auth', apiRouter);
app.use('/user', isAuth, userRouter)

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
