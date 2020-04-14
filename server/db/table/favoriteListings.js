const sql = require('../index');
var db = {};

db.getListingsByUserid = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM favoriteListings WHERE userid = ?', [userid],(err, results) => {
            if (err) return rej(err);
            if (results.length > 0) {
                return res(results[0]);//exists
            }
            return rej(err);
        });
    });
}
db.createNewUser = (userid) => {
    return new Promise ((res, rej) => {
        sql.query('INSERT INTO favoriteListings (userid) VALUES (?)', [userid] , (err, results) => {
            if (err) return rej(err);
            return res(results[0]);
        })
    })
}
db.addColumn = (lid) => {
    return new Promise ((res, rej) => {
        sql.query('ALTER TABLE favoriteListings ADD COLUMN lid? TINYINT(4)', [lid] , (err, results) => {
            if (err) return rej(err);
            return res(results[0]);
        })
    })
}

db.favoriteListing = (userid, lid) => {
    return new Promise ((res, rej) => {
        sql.query('UPDATE favoriteListings SET lid? = 1 WHERE userid = ?', [lid, userid] , (err, results) => {
            if (err) {
                console.log(err);
                return rej(err);
            }
            return res(results[0]);
        })
    })
}
db.unfavoriteListing = (userid, lid) => {
    return new Promise ((res, rej) => {
        sql.query('UPDATE favoriteListings SET lid? = 0 WHERE userid = ?', [lid, userid] , (err, results) => {
            if (err) {
                console.log(err);
                return rej(err);
            }
            return res(results[0]);
        })
    })
}


module.exports = db;