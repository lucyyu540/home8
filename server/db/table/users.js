const sql = require('../index');
var db = {};

db.updateUserByUserid = (firstName, lastName, dob, phone, nationality, gender, genderPreference, userid) => {
    return new Promise ((res, rej) => {
        sql.query('UPDATE users SET firstName = ?, lastName = ?, dob = ?, phone = ?, nationality = ?, gender = ?, genderPreference = ? WHERE userid = ?', 
        [firstName, lastName, dob, phone, nationality, gender, genderPreference, userid] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })

}
db.getUsernameByUserid = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT username FROM users WHERE userid = ?',[userid], (err, results) => {
            if (err) return rej(err);
            if (results.length > 0) {
                return res(results[0].username);//exists
            }
            return rej(err);
        });
    });
}

db.getUserByUserid = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM users WHERE userid = ?',[userid], (err, results) => {
            if (err) return rej(err);
            if (results.length > 0) {
                return res(results[0]);//exists
            }
            return rej(err);
        });
    });
}

db.getUserByUsername = (username) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM users WHERE username = ?',[username], (err, results) => {
            if (err) return rej(err);
            if (results.length > 0) {
                return res(results[0]);//exists
            }
            return rej(err);
        });
    });
}

db.getProtectedUserByUsername = (username) => {
    return new Promise((res, rej) => {
        sql.query('SELECT username, firstName, lastName, gender, nationality, dob FROM users WHERE username = ?',[username], (err, results) => {
            if (err) return rej(err);
            if (results.length > 0) {
                return res(results[0]);//exists
            }
            return rej(err);
        });
    });

}

db.getUserIdByEmail = (email) => {
    return new Promise((res, rej) => {
        sql.query('SELECT userid FROM users WHERE email = ?',[email], (err, results) => {
            if (err) return rej(err);
            if (results.length > 0) {
                return res(results[0]);//exists
            }
            return rej(err);
        });
    });
}
db.createNewUser = (userid, email, username) => {
    return new Promise ((res, rej) => {
        sql.query('INSERT INTO users (userid, email, username) VALUES (?)', [userid, email, username] , (err, results) => {
            if (err) return rej(err);
            return res(results[0]);
        })
    })
}
db.updateUsername = (id, username) => {
    return new Promise ((res, rej) => {
        sql.query('UPDATE users SET username = ? WHERE userid = ?', [username, id] , (err, results) => {
            if (err) {
                console.log(err);
                return rej(err);
            }
            return res(results);
        })
    })
}

module.exports = db;