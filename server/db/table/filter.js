const sql = require('../index');
var db = {};
/**CREATE */
db.createListing = () => {
    return new Promise((res, rej) => {
        sql.query('INSERT INTO filter () VALUES ()',(err, results) => {
            if (err) return rej(err);
            else return res(results);
        });
    });
}

db.createUser = (userid) => {
    return new Promise ((res, rej) => {
        sql.query('ALTER TABLE filter ADD COLUMN `?` VARCHAR(45)', [userid] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
/** EDIT */
db.moveout = (mate, lid) => {
    return new Promise ((res, rej) => {
        sql.query('UPDATE filter SET `'+mate+'`=? WHERE lid = ?', [2, lid] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
db.movein = (mate, lid) => {
    return new Promise ((res, rej) => {
        sql.query('UPDATE filter SET `'+mate+'`=? WHERE lid = ?', [1, lid] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
db.favorite = (mate, lid) => {
    return new Promise ((res, rej) => {
        sql.query('UPDATE filter SET ? = ? WHERE lid = ?', [mate, 3, lid] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
/**GET */
db.getFavorited = (userid) => {
    return new Promise ((res, rej) => {
        sql.query('SELECT lid FROM filter WHERE ?=?', [userid,3] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
db.getPastResidence = (userid) => {
    return new Promise ((res, rej) => {
        sql.query('SELECT lid FROM filter WHERE ?=?', [userid,2] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
db.getCurrentResidence = (userid) => {
    return new Promise ((res, rej) => {
        sql.query('SELECT lid FROM filter WHERE ?=?', [userid,1] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}



module.exports = db;