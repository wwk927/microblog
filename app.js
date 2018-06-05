var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ejs = require('ejs'); 
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');

var routes = require('./routes/index');

var app = express();

//app.use(function(req,res,next){
//	res.locals.user=req.session.user;
//	
//	var err = req.flash('error');
//	var success = req.flash('success');
//	
//	res.locals.error = err.length ? err : null;
//	res.locals.success = success.length ? success : null;
//	   
//	next();
//});

// view engine setup
app.engine('html',ejs.__express); 
app.set('view engine', 'html');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use(session({
	secret: settings.cookieSecret,
	store: new MongoStore({
		db: settings.db,
		url: 'mongodb://localhost/blog'
	})
}));

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		if(req.url !== "/favicon.ico") {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: err
			});
		}
		else {
			res.end();
		}
	});
}



// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
