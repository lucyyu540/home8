const sql = require('../index');
var db = {};
/**CREATE */
//sql.query('INSERT INTO mates (userid, friendid) SELECT ?, ? FROM DUAL WHERE NOT EXISTS(SELECT * FROM mates WHERE (userid=? AND friendid=?) OR (userid=? AND friendid=?) LIMIT 1)'
//UNIQUE
db.addMates = (userid, friendid) => {
    return new Promise ((res, rej) => {
        sql.query('INSERT INTO mates (userid, friendid) SELECT ?, ? FROM DUAL WHERE NOT EXISTS(SELECT * FROM mates WHERE userid=? AND friendid=? LIMIT 1);'+
        'INSERT INTO mates (userid, friendid) SELECT ?, ? FROM DUAL WHERE NOT EXISTS(SELECT * FROM mates WHERE userid=? AND friendid=? LIMIT 1)'
        , [userid, friendid, userid, friendid, friendid, userid, friendid, userid] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
/**EDIT */
db.addReview = (userid, friendid, review) => {
    return new Promise ((res, rej) => {
        sql.query('UPDATE mates set review=? WHERE userid=? AND friendid=?', [review, userid, friendid] , (err, results) => {
            if (err) return rej(err);
            console.log(results);
            return res(results);
        })
    })
}

/**GET */
db.getMates = (userid) => {
    return new Promise ((res, rej) => {
        sql.query('SELECT * FROM mates WHERE userid=?', [userid] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
db.getReviews = (userid) => {
    return new Promise ((res, rej) => {
        sql.query('SELECT review, userid FROM mates WHERE friendid=?', [userid] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}



module.exports = db;