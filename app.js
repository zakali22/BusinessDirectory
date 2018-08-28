var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const NodeGeocoder = require('node-geocoder');


const passportSetup = require('./config/passport-setup.js');

var indexRouter = require('./routes/index');
var businessRouter = require('./routes/business');
const categoriesRouter = require('./routes/categories');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

var app = express();

//Connect to Mongoose
var url = process.env.MONGO_URI;
mongoose.connect(url, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Database connected");
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Express Sessions
app.use(session({
	secret: 'secret',
	resave: true,
	saveUnitialized: true
}));

// Passport Middleware

app.use(passport.initialize());
app.use(passport.session());

// Express Messages
app.use(require('connect-flash')());
app.use((req, res, next) => {
	res.locals.messages = require('express-messages')(req, res);
	res.locals.user = req.user || null;
	next();
});


app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		const namespace = param.split('.')
		, root  = namespace.shift()
		, formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}

		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/business', businessRouter);
app.use('/categories', categoriesRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);

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
