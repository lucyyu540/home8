const sql = require('../index');
var db = {};

db.getListingsByCoordinates = (a, b, c, d) => {
    return new Promise((res, rej) => {
        const longCondition = ' longitude >= '+a+' AND longitude <='+ c;
        const latCondition = ' AND latitude >= '+b+' AND latitude <='+d;
        sql.query('SELECT * FROM listings WHERE active = 1 AND'+ longCondition +latCondition ,(err, results) => {
            if (err) return rej(err);
            else return res(results);
            
        });
    });
}
/** all listings owned by this user */
db.getListingsByUserid = (userid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM listings WHERE owner = ?', [userid] ,(err, results) => {
            if (err) return rej(err);
            else return res(results);//exists
        });
    });
}
/** get a listing */
db.getListingByLid = (lid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT * FROM listings WHERE lid = ?', [lid] ,(err, results) => {
            if (err) return rej(err);
            if (results.length > 0) {
                return res(results[0]);//exists
            }
            return null;
        });
    });
}
db.getMatesByLid = (lid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT mates FROM listings WHERE lid = ?', [lid] ,(err, results) => {
            if (err) return rej(err);
            if (results.length> 0) return res(results[0].mates);//exists
            return null;
        });
    });
}
db.getSpaceByLid = (lid) => {
    return new Promise((res, rej) => {
        sql.query('SELECT fromDate, toDate, price, rooming, roomType FROM listings WHERE lid = ?', [lid] ,(err, results) => {
            if (err) return rej(err);
            if (results.length>0) return res(results[0]);//exists
            return null;
        });
    });
}
/**CREATE */
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
/**EDIT */
db.updateMates = (mates, lid) => {
    return new Promise((res, rej) => {
        sql.query('UPDATE listings SET mates =?  WHERE lid = ?', [mates, lid] ,(err, results) => {
            if (err) return rej(err);
            else return res(results);
        });
    });
}
db.updateSpace = (data, lid) => {
    return new Promise((res, rej) => {
        sql.query('UPDATE listings SET fromDate=?, toDate=?, price=?, rooming=?, roomType=? WHERE lid = ?', 
        [data.fromDate, data.toDate, data.price, data.rooming, data.roomType, lid] ,(err, results) => {
            if (err) return rej(err);
            else return res(results);
        });
    });
}
db.updateListing = (data) => {
    return new Promise ((res, rej) => {
        console.log(data);
        const lid = data.lid;
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
        const owner = data.owner;
        var set = ' SET description = ?, address = ?, longitude = ?, latitude = ?, price = ?, count = ?, active = ?, '
        var set2 = 'doorman = ?, building = ?, laundry = ?, bed = ?, bath=?, roomType=?, rooming = ?, fromDate=?, toDate=?, mates = ?'
        var where = 'WHERE lid = ? AND owner = ?'
        sql.query('UPDATE listings'+ set + set2 + where , 
        [description, address, longitude, latitude, price, count, active, doorman, building, laundry, bed, bath, roomType, rooming, fromDate, toDate, mates, lid, owner], 
        (err, results) => {
            if (err) return rej(err);
            return res(results);
        })
    })
}
module.exports = db;