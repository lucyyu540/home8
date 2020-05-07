/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DEPENDECIES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**EXPRESS */
const express = require('express');
var app = express(); //initialize app variable
/**MY MODULES */
const indexRouter = require("./routes/index");
const privateRouter = require('./routes/private');
const db = require('./db/index');
const users = require('./db/table/users')
const personalityAs = require('./db/table/personalityAs');

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
//checking with auth0
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
//checking with mysql
async function checkUsers(req, res, next) {
	const userid = req.user.sub;
	const username = req.user['https://home8-api.com/username'];
	const email = req.user['https://home8-api.com/email'];
	//console.log('in checkUsers middleware', userid, username, email);
	try{
		const user = await users.getUserByUserid(userid);
		if (user) {
			console.log('(middleware) user exists');
			next();
		}
		else {
			console.log('creating new user');
			await users.createNewUser(userid, email, username);//create row
			await personalityAs.createNewUser(userid);//create row
			console.log('successfully created new user in mysql');
			next();
		}
		
	}
	catch (err) {
		console.log('(middleware) error')
		res.json(err);		
	}
}

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~MIDDLEWARE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(morgan('dev'));

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~ROUTES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.use('/', indexRouter)
app.use('/private', jwtCheck, checkUsers, privateRouter );//protected
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