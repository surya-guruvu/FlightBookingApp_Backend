var createError = require('http-errors');
var express = require('express');
var path = require('path'); 
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const fs = require('fs');

var session = require('express-session');
// var FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var flightRouter = require('./routes/flightRouter');
var authenticate = require('./authenticate');
var fileUpload = require('./routes/fileUpload');


const cors = require('cors');
const bookRouter = require('./routes/bookRouter');

var app = express();
 
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const url='mongodb://localhost:27017/Ayrus';
const connect=mongoose.connect(url);
connect.then((db)=>{
  console.log("connected correctly to the server");
})
.catch((err)=>{
  console.log(err);
})

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/flights',flightRouter);
app.use('/upload_files',fileUpload);
app.use('/book_flight',bookRouter);

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
