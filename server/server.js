/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DEPENDECIES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**EXPRESS */
const express = require('express');
var app = express(); //initialize app variable
/**MY MODULES */
const indexRouter = require("./routes/index");
const privateRouter = require('./routes/private');
const db = require('./db/index');

/**MODULES */
const bodyParser = require('body-parser');//access req.body
const cors = require('cors');//handle cross domain requests
require('dotenv').config({path:__dirname+'./.env'});
const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const morgan = require('morgan');


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~AUTH~CONFIG~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var jwtCheck = jwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: 'https://soyuwantapotato.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://home8-api.com',
  issuer: 'https://soyuwantapotato.auth0.com/',
  algorithms: ['RS256']
}); 


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~MIDDLEWARE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(morgan('dev'));

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~ROUTES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.use('/', indexRouter)
app.use('/private', jwtCheck, privateRouter );//protected
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ERROR~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
  });
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
});
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**MODULE EXPORT */
module.exports = app;  