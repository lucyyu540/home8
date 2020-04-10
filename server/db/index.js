/**DEPENDENCIES */
const mysql = require('mysql');
require('dotenv').config({path:__dirname+'/./../.env'});//config username and password hiding

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//make calls to pool (e.g. make queries) and
//always create a connection and manage a list of connections
const pool = mysql.createPool({
    //no. of connections will node mysql will hold open to db
    connectionLimit: 10,
    database: process.env.MYSQL_DB_NAME,
    password: process.env.MYSQL_PW,
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
});

//check if database is connected
pool.getConnection( (err) => {
    if (err) {
        console.log('db connection error');
        throw err;
    }
    console.log('mysql connected!')
});

module.exports = pool;

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/** QUERIES */
/**USERS */
/** 
db.getUserByEmail = (email) => {
    return new Promise((res, rej) => {
        pool.query('SELECT * FROM user WHERE email = ?',[email], (err, results) => {
            if (err) {
                return rej(err);
            }
            return res(results);
        });
    });

}
//cus the way msql works, it does a callback after you make a query
//so return a promise anytime anytime we make a call to the db
//then whenever we use db connection, treat it like a promis rather than a callback which makes it easier for async
module.exports = db;*/