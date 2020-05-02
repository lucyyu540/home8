const sql = require('../index');
var db = {};
db.putAnswer = (userid, qid, ans) => {
    return new Promise ((res, rej) => {
        sql.query('UPDATE personalityAs SET qid? = ?, x = ? WHERE userid = ?', 
        [qid, ans, qid+1,userid] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}

db.getAnswersByUserid = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM personalityAs WHERE userid = ?', [userid],(err, results) => {
            if (err) return rej(err);
            if (results.length > 0) {
                return res(results[0]);//exists
            }
            return rej(err);
        });
    });
}
db.getX = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM personalityAs WHERE userid = ?', [userid],(err, results) => {
            if (err) return rej(err);
            if (results.length > 0) {
                return res(results[0].x);//exists
            }
            return rej(err);
        });
    });
}
db.updateX = (x, userid) => {
    return new Promise ((res, rej) => {
        sql.query('UPDATE personalityAs SET x = ? WHERE userid = ?', [x, userid] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
db.createNewUser = (userid) => {
    return new Promise ((res, rej) => {
        sql.query('INSERT INTO personalityAs (userid, x) VALUES (?,1)', [userid] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
db.addColumn = (n) => {
    return new Promise ((res, rej) => {
        sql.query('ALTER TABLE personalityAs ADD COLUMN qid? INT(1)', [n] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}


module.exports = db;