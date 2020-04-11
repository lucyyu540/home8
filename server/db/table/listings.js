const sql = require('../index');
var db = {};

db.getListingsByCoordinates = (a, b, c, d) => {
    return new Promise((res, rej) => {
        const longCondition = ' longitude >= '+a+' AND longitude <='+ c;
        const latCondition = ' AND latitude >= '+b+' AND latitude <='+d;
        sql.query('SELECT * FROM listings WHERE active = 1 AND'+ longCondition +latCondition ,(err, results) => {
            if (err) return rej(err);
            if (results.length > 0) {
                return res(results);//exists
            }
            return rej(err);
        });
    });
}


module.exports = db;