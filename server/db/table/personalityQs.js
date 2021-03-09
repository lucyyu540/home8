const sql = require('../index');
var db = {};

db.getQuestionByQid = (qid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM personalityQs WHERE qid = ?', [qid],(err, results) => {
            if (err) return rej(err);
            if (results.length > 0) {
                return res(results[0]);//exists
            }
            return rej(err);
        });
    });
}
db.getQuestionForUser = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT q.one, q.two, q.three, q.four, q.five FROM personalityQs q '+
        'LEFT JOIN personalityAs a ON a.qid != q.qid '+
        'LIMIT 1', [userid],(err, results) => {
            if (err) return rej(err);
            if(results.length==0) return null
            return res(results[0]);
        });
    });
}

db.addQuestion = (question, one, two, three, four, five) => {
    return new Promise ((res, rej) => {
        sql.query('INSERT INTO personalityQs (question, 1, 2, 3, 4, 5) VALUES(?,?,?,?,?,?)', [question, one, two, three, four, five] , (err, results) => {
            if (err) return rej(err);
            return res(results[0]);
        })
    })
}

db.getSize = () => {
    return new Promise((res, rej) => {
        sql.query('SELECT count(*) as count FROM personalityQs', (err, results) => {
            if (err) return rej(err);
            return res(results.count);
        });
    });
    
}


module.exports = db;