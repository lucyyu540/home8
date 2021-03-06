/**DEPENDENCIES */
const express = require('express');
const router = express.Router();
const users = require('../db/table/users')
const listings = require('../db/table/listings')
const filter = require('../db/table/filter');
const personalityAs = require('../db/table/personalityAs');
const personalityQs = require('../db/table/personalityQs');
const matesDB = require('../db/table/mates');

const notificationRouter = require('./notification');
const listingRouter = require('./listing');
const residenceRouter = require('./residence');
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~MIDDLEWARE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
router.use('/notification', notificationRouter); 
router.use('/listing', listingRouter); 
router.use('/residence', residenceRouter); 

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
router.put('/listings',  async (req,res) => {
    const userid = req.user.sub;
    console.log('endpoint: /private/listings ');

    const a = req.body.a;
    const b = req.body.b;
    const c = req.body.c;
    const d = req.body.d;

    const sorted = {
        favorites: [],
        public: []
    }
    //search in users
    try {
        const results = await listings.getListingsByCoordinates(a,b,c,d);
        const favorites = await filter.getFavorited(userid);
        const ind = 0;
        for (var i = 0 ; i < results.length; i ++) {
            const owner = await users.getUsernameByUserid(results[i].owner);
            results[i].owner = [results[i].owner, owner];//owner username
            /**mates username */
            if (results[i].mates) {
                const arr = results[i].mates.split(" ");
                for (var j = 0 ; j < arr.length; j ++) {
                    const username = await users.getUsernameByUserid(arr[j]);
                    arr[j] = [arr[j], username];
                }
                results[i].mates = arr;
            }
            /**String to array */
            /**price, roomType, rooming, fromDate, toDate */
            if (results[i].price) {
                results[i].price = results[i].price.split(" ");
                results[i].roomType  = results[i].roomType.split(" ");
                results[i].rooming  = results[i].rooming.split(" ");
                results[i].fromDate  = results[i].fromDate.split(" ");
                results[i].toDate  = results[i].toDate.split(" ");
            }
            else {
                results[i].price = [];
                results[i].roomType = [];
                results[i].rooming = [];
                results[i].fromDate = [];
                results[i].toDateArr = [];
            }

            /**sort into favorites */
            var favorited = false;
            for (var j = ind; j < favorites.length; j ++) {
                if (results[i].lid == favorites[j].lid) {
                    favorited = true;
                    sorted.favorites.push(results[i]);
                    ind ++;
                    break;
                }
                else if (results[i].lid < favorites[j].lid){
                    favorited = false;
                    ind ++;
                    break;
                }
            }
            if (!favorited) sorted.public.push(results[i]);
        }
        res.json(sorted).end();
    }
    catch (err) {
        console.log('the error',err);
    }   
})

/**GET INDIVIDUAL LISTING DETAILS */
router.get('/listing/:lid', async (req, res) => {
    const lid = req.params.lid;
    console.log('endpoint: private/listing/'+lid);
    const userid = req.user.sub;
    try {
        const result = await listings.getListingByLid(lid);
        /**CHECK IF USER IS OWNER */
        var allowed = false;
        if (result.owner == userid) allowed = true;
        const owner = await users.getUsernameByUserid(result.owner);
        result.owner = [result.owner, owner];
        /**CONVERTING USERID --> USERNAME */
        if (result.mates) {
            const arr = result.mates.split(" ");
            for ( var i = 0 ; i < arr.length ; i ++) {
                if (arr[i] == userid) allowed = true; //CHECK IF USER IS MATE
                const username = await users.getUsernameByUserid(arr[i]);
                arr[i] = [arr[i], username];
            }
            result.mates = arr;
        }
        else result.mates = [];
        /**price, roomType, rooming, fromDate, toDate */
        if (result.price) {//&&!allowed
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
        console.log(result);
        if (allowed) res.json(result);
        else {
            result.address = null;//hide address
            res.json(result);
        }
    }
    catch (err) {
        console.log(err);
        res.json(err);
    }
});
/**LISTINGS I OWN************************************************************************ */
router.get('/my-listings', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/my-listings', userid);
    try {
        const results = await listings.getListingsByUserid(userid);
        for (var i = 0 ; i < results.length ; i ++) {
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
                results[i].price = results[i].price.split(" ");
                results[i].roomType  = results[i].roomType.split(" ");
                results[i].rooming  = results[i].rooming.split(" ");
                results[i].fromDate  = results[i].fromDate.split(" ");
                results[i].toDate  = results[i].toDate.split(" ");
            }
            else {
                results[i].price = [];
                results[i].roomType = [];
                results[i].rooming = [];
                results[i].fromDate = [];
                results[i].toDateArr = [];
            }
        }            
        res.json(results);
    }
    catch(err) {
        console.log(err);
        res.json(err);
    }
})
router.put('/create-listing', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/create-listing' , userid);
    const mates = arrayToStringMates(req.body.mates);
    if (mates) {
        try {await filter.movein(mates);}//owner move in}
        catch (err) {console.log(err);}
    }
    const price = arrayToString(req.body.price);
    const rooming = arrayToString(req.body.rooming);
    const roomType = arrayToString(req.body.roomType);
    const fromDate = arrayToString(req.body.fromDate);
    const toDate = arrayToString(req.body.toDate);
    const data = {
        owner: userid,
        address: req.body.address,
        longitude: parseFloat(req.body.longitude),
        latitude: parseFloat(req.body.latitude),
        description: req.body.description,
        price: price,
        count: parseInt(req.body.count),
        doorman: parseInt(req.body.doorman),
        building: req.body.building,
        laundry: req.body.laundry,
        bed: parseInt(req.body.bed),
        bath: parseInt(req.body.bath),
        roomType: roomType,
        rooming: rooming,
        fromDate: fromDate,
        toDate: toDate,
        active: parseInt(req.body.active),
        mates: mates
    }
    try {
        const result = await listings.createListing(data);
        console.log(result);
        res.end();
    }
    catch(err) {
        console.log(err);
        res.end();
    }
})
router.put('/update-listing', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/update-listing' , userid);
    const lid = parseInt(req.body.lid);
    const mates = arrayToStringMates(req.body.mates);
    try {
        var originalMates = await listings.getMatesByLid(lid);
        if (originalMates != mates) {//find difference 
            var map = {};
            if (originalMates) originalMates = originalMates.split(" ");
            else originalMates = [];
            for (var i = 0 ; i < originalMates.length; i ++) {map[originalMates[i]] = 1;}
            var deleteMates = [];
            var addedMates = [];
            for (var i = 0 ; i < req.body.mates.length; i ++) {
                if (map[req.body.mates[i][0]]) {
                    delete map[req.body.mates[i][0]];//no change
                }
                else addedMates.push(req.body.mates[i][0]);//new = owner
            }
            for (mate in map) {
                if (mate) deleteMates.push(mate);//remaining --> deleted
            }
            console.log('deleted mates', deleteMates);
            console.log('added mates', addedMates);//= owner
            //new mates
            for (var i = 0 ; i < addedMates.length; i ++) {
                filter.movein(addedMates[i], lid);
            }
            //deleted mates
            for (var i = 0 ; i < deleteMates.length; i ++) {
                filter.moveout(deleteMates[i], lid);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    /** if mates were, deleted 1) notify 2) update filter table */
    /** the only mate that can be added in this url is owner
     * 1) no notification
     * 2) update filter table
     */
    const price = arrayToString(req.body.price);
    const rooming = arrayToString(req.body.rooming);
    const roomType = arrayToString(req.body.roomType);
    const fromDate = arrayToString(req.body.fromDate);
    const toDate = arrayToString(req.body.toDate);
    const data = {
        owner: userid,
        lid: parseInt(req.body.lid),
        address: req.body.address,
        longitude: parseFloat(req.body.longitude),
        latitude: parseFloat(req.body.latitude),
        description: req.body.description,
        price: price,
        count: parseInt(req.body.count),
        doorman: !!parseInt(req.body.doorman),
        building: req.body.building,
        laundry: req.body.laundry,
        bed: parseInt(req.body.bed),
        bath: parseInt(req.body.bath),
        roomType: roomType,
        rooming: rooming,
        fromDate: fromDate,
        toDate: toDate,
        active: !!parseInt(req.body.active),
        mates: mates
    }
    try {
        const result = await listings.updateListing(data);
        console.log(result);
        res.end();
    }
    catch(err) {
        console.log(err);
        res.end();
    }
})
/**PROFILE ************************************************************************ */
/**PRIVATE PROFILE GIVEN USERNAME */
router.put('/my-profile', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/my-profile');
    //search in users
    try {
        const results = await users.getUserByUserid(userid);
        const reviews = await matesDB.getReviews(userid);
        results.reviews = reviews;
        console.log(results);
        res.json(results).end();
    }
    catch (err) {
        console.log(err);
        console.log('user DNE in mysql');
        res.json(err);
    }
})
router.put('/edit-profile', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/edit-profile ' + userid);
    console.log(req.body);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const dob = req.body.dob;
    const phone = req.body.phone;
    const nationality = req.body.nationality;
    const gender = req.body.gender;
    const genderPreference = req.body.genderPreference;
    try {
        const results = await users.updateUserByUserid(firstName, lastName, dob, phone, nationality, gender, genderPreference, userid)
        console.log(results);
        res.json(results);
    }
    catch (err) {
        console.log('update user error');
        res.json(err);
    }
});
router.get('/get-question', async (req, res) => {
    console.log('endpoint /private/get-question')
    const userid = req.user.sub;
    try {
        const result = await personalityQs.getQuestionForUser(userid);
        const n = await personalityQs.getSize();
        const x = await personalityAs.getSize(userid);
        const data = {
            qTemp : result,
            n : n,
            x : x
        }
        if (x >= n) result.qTemp = { question: 'Completed all questions! Please come back later.'}
        console.log(data)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.json(err);
    }
});

router.put('/compare', async (req,res) => {
    const me = req.user.sub;
    console.log('endpoint: /private/compare', me);
    console.log('on this proifle page', req.body);
    try {
        const user = await users.getUserByUsername(req.body.username);
        const you = user.userid;
        const data = await personalityAs.getAnswersOfTwoUsers(me, you);
        const similarity = euclideanDistance(data);
        console.log('similarity score=', similarity);
        res.json({score: similarity, comparison: data});
    }
    catch(err) {
        res.json(err);
    }
});

router.put('/submit-answer', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint private/submit-answer', userid);
    console.log(req.body);
    try {
        const result = await personalityAs.putAnswer(userid, req.body.qid, parseInt(req.body.ans));
        console.log(result);
        res.end();
    }
    catch(err) {
        console.log(err);
        res.json(err);
    }
})
function arrayToStringMates(arr) {
    var s = '';
    for (var i = 0 ; i < arr.length; i ++) {
        if (i == 0) s = arr[0][0];
        else s += " " + arr[i][0];
    }
    return s;
}
function arrayToString(arr) {
    var s = '';
    for (var i = 0 ; i < arr.length; i ++) {
        if (i == 0) s = arr[0];
        else s += " " + arr[i];
    }
    return s;
}
function euclideanDistance(arr) {
    var sum = 0;
    var maxDistance = 0;
    for (var i = 1 ; i < arr.length; i ++) {
        sum += Math.pow(arr[i].diff, 2);//(a-b)^2
        maxDistance += 16;//(5-1)^2
    }
    var distance = Math.sqrt(sum);
    maxDistance = Math.sqrt(maxDistance);
    if (maxDistance == 0) return 0;
    const frac = (distance/maxDistance);//closer to zero the more similar
    return ((1-frac)*100).toFixed(2);
}

module.exports = router;