const sql = require('../index');
var db = {};

db.getUnread = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM messages WHERE `to` = ? AND `read` = ?', [userid, 0],(err, results) => {
            if (err) return rej(err);
            return res(results);
        });
    });
}
db.getMessages = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM messages WHERE (`from` = ? OR`to` = ? )AND type = ?', [userid, userid, 'message'],(err, results) => {
            if (err) return rej(err);
            return res(results);
        });
    });
}
db.getReceivedRequests = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM messages WHERE `to` = ? AND type = ?', [userid, 'request'],(err, results) => {
            if (err) return rej(err);
            return res(results);
        });
    });
}
db.getSentRequests = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM messages WHERE `from` = ? AND type = ?', [userid, 'request'],(err, results) => {
            if (err) return rej(err);
            return res(results);
        });
    });
}

db.addMessage = (data) => {
    return new Promise ((res, rej) => {
        const time = new Date();
        sql.query('INSERT INTO messages (`from`, `to`, type, lid, content, time, `read`) VALUES (?)', [[data.from, data.to, data.type, data.lid, data.content, time, 0]] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}


module.exports = db;