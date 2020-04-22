const sql = require('../index');
var db = {};

db.getListingsByCoordinates = (a, b, c, d) => {
    return new Promise((res, rej) => {
        const longCondition = ' longitude >= '+a+' AND longitude <='+ c;
        const latCondition = ' AND latitude >= '+b+' AND latitude <='+d;
        sql.query('SELECT * FROM listings WHERE active = 1 AND'+ longCondition +latCondition ,(err, results) => {
            if (err) return rej(err);
            if (results.length > 0) {
                return res(results);//exists
            }
            return rej(err);
        });
    });
}
db.getListingsByUserid = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM listings WHERE owner = ?', [userid] ,(err, results) => {
            if (err) return rej(err);
            if (results.length > 0) {
                return res(results);//exists
            }
            return rej(err);
        });
    });
}
db.createListing = (data) => {
    return new Promise ((res, rej) => {
        console.log(data);
        const owner = data.owner;
        const description = data.description;
        const address = data.address;
        const longitude = data.longitude;
        const latitude = data.latitude;
        const price = data.price;
        const count = data.count;
        const active = data.active;
        const doorman = data.doorman;
        const building = data.building;
        const laundry = data.laundry;
        const bed = data.bed;
        const bath = data.bath;
        const roomType = data.roomType;
        const rooming = data.rooming;
        const fromDate = data.fromDate;
        const toDate = data.toDate;
        const mates = data.mates;
        var q = 'INSERT INTO listings (owner, address, longitude, latitude, fromDate, toDate, price, count, building, doorman, laundry, bed, bath, roomType, rooming, active, description, mates) VALUES (?)';
        sql.query(q, [[owner, address, longitude, latitude, fromDate, toDate, price, count, building, doorman, laundry, bed, bath, roomType, rooming, active, description, mates]], (err, results) => {
            if (err) return rej(err);
            return res(results);
        });
    })
}
db.updateListing = (data) => {
    /**return new Promise ((res, rej) => {
        sql.query('UPDATE listings SET x = ? WHERE userid = ?', [x, userid] , (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })*/
}
module.exports = db;