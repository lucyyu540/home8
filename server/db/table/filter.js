const sql = require('../index');
var db = {};
/** EDIT */
db.moveout = (userid, lid) => {
    return new Promise ((res, rej) => {
        sql.query('UPDATE filter SET current=?, past=? WHERE lid=? AND userid = ?', [0,1,lid, userid] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
db.movein = (userid, lid) => {
    return new Promise ((res, rej) => {
        sql.query('INSERT INTO filter (lid, userid, current) VALUES (?,?,?)'+
        'ON DUPLICATE KEY UPDATE current=?, past=?', 
        [lid, userid, 1, 1, 0], (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
db.favorite = (userid, lid) => {
    return new Promise ((res, rej) => {
        sql.query('INSERT INTO filter (lid, userid, favorite) VALUES(?,?,?)'+
        'ON DUPLICATE KEY UPDATE favorite=?', 
        [lid, userid, 1,1] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
db.unfavorite = (userid, lid) => {
    return new Promise ((res, rej) => {
        sql.query('INSERT INTO filter (lid, userid, favorite) VALUES(?,?,?)'+
        'ON DUPLICATE KEY UPDATE favorite=?', 
        [lid, userid, 0,0] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
/**GET */
db.getFavorited = (userid) => {
    return new Promise ((res, rej) => {
        sql.query('SELECT lid FROM filter WHERE userid=? AND favorite=?', [userid,1] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
db.getPastResidence = (userid) => {
    return new Promise ((res, rej) => {
        sql.query('SELECT lid FROM filter WHERE userid=? AND past=?', [userid,1] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
db.getCurrentResidence = (userid) => {
    return new Promise ((res, rej) => {
        sql.query('SELECT lid FROM filter WHERE userid=? AND current=?', [userid,1] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}



module.exports = db;