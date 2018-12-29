var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var session = require('express-session')
var expressValidator = require('express-validator')
var fileUpload = require('express-fileupload')

var {mongoURI} = require('./config/key');

mongoose.connect(mongoURI, {useNewUrlParser: true})
  .then(console.log("Connected to MongoDB :)))"))
  .catch(console.log)

var app = express();


// Middleware: body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Middleware: express-session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

// Middleware: expreess-validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  },
  customValidators: {
    isImage: function(value, fileName) {
      var extension = (path.extname(fileName)).toLowerCase();
      switch (extension) {
        case ".jpg":
          return ".jpg";

        case ".jpeg":
          return ".jpeg";

        case ".png":
          return ".png";

        case "":
          return true;
          
        default:
          return false;
      }
    }
  }
}));

// Middleware: express-message && connect-flash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Middleware: express-upload
app.use(fileUpload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/admin/pages', require('./routes/admin-pages'));
app.use('/admin/categories', require('./routes/admin-categories'));
app.use('/admin/products', require('./routes/admin-products'));

// set global errors variable
app.locals.errors = null

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
