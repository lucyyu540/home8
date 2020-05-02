const sql = require('../index');
var db = {};
/**EDIT */
db.deleteMessage = (mid) => {
    return new Promise ((res, rej) => {
        sql.query('DELETE FROM messages WHERE mid = ?', [mid] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}

db.readMessage = (midArr) => {
    return new Promise ((res, rej) => {
        sql.query('UPDATE messages SET `read` = ? WHERE mid IN (?)', [1, midArr] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
/**GET */
db.getUnread = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM messages WHERE `to` = ? AND `read` = ?', [userid, 0],(err, results) => {
            if (err) return rej(err);
            return res(results);
        });
    });
}
/**sent or received */
db.getAll = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM messages WHERE `from` = ? OR `to` = ?', [userid, userid],(err, results) => {
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
/**CREATE */
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