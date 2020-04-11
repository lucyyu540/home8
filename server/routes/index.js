/**DEPENDENCIES */
const express = require('express');
const router = express.Router();
const users = require('../db/table/users')
const listings = require('../db/table/listings')

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**PUBLIC LISTTINGS BASED ON COORDINATES */
router.put('/listings',  async (req,res) => {
    console.log('client traveled to endpoint /listings');
    console.log(req.body);
    const a = req.body.a;
    const b = req.body.b;
    const c = req.body.c;
    const d = req.body.d;
    try{
        const results = await listings.getListingsByCoordinates(a,b,c,d);
        //modify results:
        // convert id --> usernames
        for (var i = 0 ; i < results.length; i ++) {
            const owner = await users.getUsernameByUserid(results[i].owner);
            var mate1, mate2, mate3, mate4, mate5, mate6;
            if (results[i].mate1 != null) mate1 = await users.getUsernameByUserid(results[i].mate1);
            if (results[i].mate2 != null) mate2 = await users.getUsernameByUserid(results[i].mate2);
            if (results[i].mate3 != null) mate3 = await users.getUsernameByUserid(results[i].mate3);
            if (results[i].mate4 != null) mate4 = await users.getUsernameByUserid(results[i].mate4);
            if (results[i].mate5 != null) mate5 = await users.getUsernameByUserid(results[i].mate5);
            if (results[i].mate6 != null) mate6 = await users.getUsernameByUserid(results[i].mate6);

            results[i].owner = [results[i].owner, owner];
            results[i].mate1 = [results[i].mate1, mate1];
            results[i].mate2 = [results[i].mate2, mate2];
            results[i].mate3 = [results[i].mate3, mate3];
            results[i].mate4 = [results[i].mate4, mate4];
            results[i].mate5 = [results[i].mate5, mate5];
            results[i].mate6 = [results[i].mate6, mate6];
        }
        console.log(results);
        res.json(results);
    }
    catch (err) {
        console.log(err);
        res.json(err);
    }
})
//INSERT INTO listings (address, longitude, latitude, owner, price, count, active, mate1) VALUES ('280 Marin Blvd', -8242276.281937191, 4970792.388188603, 'auth0|5e8a27cb6595110c10cfe296', 1335, 2, true, 'auth0|5e8a27cb6595110c10cfe296')

/**PUBLIC PROFILE GIVEN USERNAME */
router.put('/:username', async (req, res) => {
    console.log('endpoint: /'+ req.params.username);
    //search in users
    try {
        const results = await users.getProtectedUserByUsername(req.params.username);
        console.log(results[0]);
        res.json(results[0]).end();
    }
    catch (err) {
        console.log(err);
        console.log('user DNE in mysql');
    }
})
module.exports = router;