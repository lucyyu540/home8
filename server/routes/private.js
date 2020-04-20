/**DEPENDENCIES */
const express = require('express');
const router = express.Router();
const users = require('../db/table/users')
const listings = require('../db/table/listings')
const favoriteListings = require('../db/table/favoriteListings');
const personalityAs = require('../db/table/personalityAs');
const personalityQs = require('../db/table/personalityQs');
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
        const favorites = await favoriteListings.getListingsByUserid(userid);
        console.log('favorites: ', favorites);
        const results = await listings.getListingsByCoordinates(a,b,c,d);
        for (var i = 0 ; i < results.length; i ++) {
            const owner = await users.getUsernameByUserid(results[i].owner);
            results[i].owner = [results[i].owner, owner];
            for (var j = 1; j <= 6; j ++) {
                var mate = 'mate'+j;
                console.log(mate, results[i][mate]);
                if (results[i][mate] !== null){
                    console.log('fetching username');
                    const temp = await users.getUsernameByUserid(results[i][mate]);
                    results[i][mate] = [results[i][mate], temp];
                    console.log(results[i][mate]);
                }
            }
            const lid = 'lid'+results[i].lid;
            if (favorites[lid]) sorted.favorites.push(results[i]);
            else sorted.public.push(results[i]);
        }
        console.log(sorted);
        res.json(sorted).end();
    }
    catch (err) {
        console.log('the error',err);
    }   
})
router.get('/my-listings', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/my-listings', userid);
    try {
        const results = await listings.getListingsByUserid(userid);
        console.log(results);
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
    const data = {
        owner: userid,
        address: req.body.address,
        longitude: parseFloat(req.body.longitude),
        latitude: parseFloat(req.body.latitude),
        description: req.body.description,
        price: parseFloat(req.body.price),
        count: parseInt(req.body.count),
        active: 1,
        doorman: parseInt(req.body.doorman),
        building: req.body.building,
        laundry: req.body.laundry,
        bed: parseInt(req.body.bed),
        bath: parseInt(req.body.bath),
        roomType: req.body.roomType,
        rooming: req.body.rooming,
        fromDate: req.body.fromDate,
        toDate: req.body.toDate
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
/**PRIVATE PROFILE GIVEN USERNAME */
router.put('/my-profile', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/my-profile');
    //search in users
    try {
        const results = await users.getUserByUserid(userid);
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
    console.log('endpoint: private/edit-profile')
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
        res.end();
    }
    catch (err) {
        res.json(err);
    }
});
router.get('/get-question', async (req, res) => {
    console.log('endpoint /private/get-question')
    const userid = req.user.sub;
    var result = 'before try';
    try {
        const x = await personalityAs.getX(userid);
        const n = await personalityQs.getSize();
        if (x > n) {
            result = {
                qTemp: { question: 'Completed all questions! Please come back later.'},
                x : x,
                n: n,
            }
            console.log(result);
            return res.json(result);
        }
        const qTemp = await personalityQs.getQuestionByQid(x);
        result = {
            qTemp: qTemp,
            x: x,
            n: n
        }
        console.log(result);
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.json(err);
    }
});

router.put('/compare', async (req,res) => {
    const me = req.user.sub;
    try {
        const you = await users.getUsernameByUserid(req.body.username);
        const myAs = await personalityAs.getAnswersByUserid(me);
        const yourAs = await personalityAs.getAnswersByUserid(you);
        const similarity = euclideanDistance(myAs, yourAs);
        res.json(similarity);
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


function euclideanDistance(A, B) {
    var sum = 0;
    var maxDistance = 0;
    for (var i = 2 ; i < A.length; i ++) {
        if (A[i] || B[i]) break;
        sum += Math.pow(A[i] - B[i], 2);//(a-b)^2
        maxDistance += 16;
    }
    var distance = Math.sqrt(sq);
    maxDistance = Math.sqrt(maxDistance);
    if (maxDistance == 0) return 0;
    const percentage = (distance/maxDistance);
    return (1-percentage)*100;
}

module.exports = router;