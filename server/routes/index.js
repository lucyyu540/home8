/**DEPENDENCIES */
const express = require('express');
const router = express.Router();
const users = require('../db/table/users');
const listings = require('../db/table/listings');
const matesDB = require('../db/table/mates')

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
        for (var i = 0 ; i < results.length; i ++) {
            const owner = await users.getUsernameByUserid(results[i].owner);
            results[i].owner = [results[i].owner, owner];//convert owner id 
            results[i].address = null; //hide address
            if (results[i].mates) {
                const arr = results[i].mates.split(" ");
                for (var j = 0 ; j < arr.length; j ++) {
                    const username = await users.getUsernameByUserid(arr[j]);
                    arr[j] = [arr[j], username];
                }
                results[i].mates = arr;
            }
            /**price, roomType, rooming, fromDate, toDate */
            if (results[i].price) {
                const priceArr = results[i].price.split(" ");
                const roomTypeArr = results[i].roomType.split(" ");
                const roomingArr = results[i].rooming.split(" ");
                const fromDateArr = results[i].fromDate.split(" ");
                const toDateArr = results[i].toDate.split(" ");
                results[i].price = priceArr;
                results[i].roomType = roomTypeArr;
                results[i].rooming = roomingArr;
                results[i].fromDate = fromDateArr;
                results[i].toDateArr = toDateArr;
            }
            else {
                results[i].price = [];
                results[i].roomType = [];
                results[i].rooming = [];
                results[i].fromDate = [];
                results[i].toDateArr = [];
            }
        }
        console.log(results);
        res.json(results);
    }
    catch (err) {
        console.log(err);
        res.json(err);
    }
})

/**PUBLIC PROFILE GIVEN USERNAME */
router.put('/:username', async (req, res) => {
    console.log('endpoint: /'+ req.params.username);
    //search in users
    try {
        const results = await users.getProtectedUserByUsername(req.params.username);
        const reviews = await matesDB.getReviews(results.userid);
        results.reviews = reviews;
        console.log(results);
        res.json(results).end();
    }
    catch (err) {
        console.log(err);
        console.log('user DNE in mysql');
    }
})
/**GET INDIVIDUAL LISTING GIVEN LID */
router.get('/listing/:lid', async (req, res) => {
    const lid = req.params.lid;
    console.log('endpoint : /listing/' + lid);
    try {
        const result = await listings.getListingByLid(lid);
        const owner = await users.getUsernameByUserid(result.owner);
        result.owner = [result.owner, owner];
        /** CONVERT USERID --> USERNAME */
        if (result.mates) {
            const arr = result.mates.split(" ");
            for ( var i = 0 ; i < arr.length ; i ++) {
                const username = await users.getUsernameByUserid(arr[i]);
                arr[i] = [arr[i], username];
            }
            result.mates = arr;
        }
        /**price, roomType, rooming, fromDate, toDate */
        if (result.price) {
            result.price = result.price.split(" ");
            result.roomType  = result.roomType.split(" ");
            result.rooming  = result.rooming.split(" ");
            result.fromDate  = result.fromDate.split(" ");
            result.toDate  = result.toDate.split(" ");
        }
        else {
            result.price = [];
            result.roomType = [];
            result.rooming = [];
            result.fromDate = [];
            result.toDateArr = [];
        }
        /**HIDE ADDRESS */
        result.address = null;
        res.json(result);
    }
    catch(err) {
        console.log(err);
        res.json(err);
    }
})
module.exports = router;