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
        sql.query('SELECT a.ans-b.ans as diff, q.qid FROM personalityAs WHERE a.userid = ? AND b.userid = ? AND a.qid = b.qid', 
        [user1,user2],
        (err, results) => {
            if (err) return rej(err);
            return res(results);
        });
    });
}
db.getSize = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT count(*) as count FROM personalityAs group by ?', [userid], (err, results) => {
            if (err) return rej(err);
            return res(results.count);
        });
    });
    
}


module.exports = db;