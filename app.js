let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let socketMiddleWare = function(req, res, next) {
  req.io = app.get('socket')
  next()
};

mongoose.Promise = global.Promise;
mongoose.set('debug', true);

mongoose.connect('mongodb://dbuser1:dbuser1@ds039281.mlab.com:39281/session', { useNewUrlParser: true }).then(
  (db)=> {console.log('Database connected')},
  (err)=>{console.log('CONNECTION FAILED TO DATABASE, CHECK INTERNET CONNECTION');reject(err);}
);

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', socketMiddleWare, indexRouter);
app.use('/users', socketMiddleWare, usersRouter);

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
