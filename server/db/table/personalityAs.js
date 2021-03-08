const sql = require('../index');
var db = {};
db.putAnswer = (userid, qid, ans) => {
    return new Promise ((res, rej) => {
        sql.query('INSERT INTO personalityAs (userid, qid, ans) VALUES (?,?,?)', 
        [userid, qid, ans] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}

db.getAnswersOfTwoUsers = (user1, user2) => {
    return new Promise((res, rej) => {
        sql.query('SELECT a.ans as me, b.ans as you, q.qid FROM personalityAs WHERE a.userid = ? AND b.userid = ? AND a.qid = b.qid', 
        [user1,user2],
        (err, results) => {
            if (err) return rej(err);
            if (results.length > 0) {
                return res(results[0]);//exists
            }
            return rej(err);
        });
    });
}


module.exports = db;