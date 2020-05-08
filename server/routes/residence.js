/**DEPENDENCIES */
const express = require('express');
const router = express.Router();
const listings = require('../db/table/listings')
const filter = require('../db/table/filter');
const matesDB = require('../db/table/mates');
const users = require('../db/table/users');
const messages = require('../db/table/messages')
const personalityAs = require('../db/table/personalityAs');
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
router.get('/history', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: /private/residence/history', userid);
    try {
        const currentResidence = await filter.getCurrentResidence(userid);
        const pastResidence = await filter.getPastResidence(userid);
        const mates = await matesDB.getMates(userid);
        for (var i = 0 ; i < currentResidence.length; i ++) {
            const temp = await listings.getListingByLid(currentResidence[i].lid);
            currentResidence[i] = temp;
        }
        for (var i = 0 ; i < pastResidence.length; i ++) {
            const temp = await listings.getListingByLid(pastResidence[i].lid);
            pastResidence[i] = temp;
        }
        const myAs = await personalityAs.getAnswersByUserid(userid);
        for (var i = 0 ; i < mates.length; i ++) {
            const temp = await users.getUsernameByUserid(mates[i].friendid);
            const yourAs = await personalityAs.getAnswersByUserid(mates[i].friendid);
            const score = euclideanDistance(myAs, yourAs);
            mates[i] = {
                id: mates[i].friendid, 
                username: temp, 
                review: mates[i].review,
                score: score
            };
        }
        const result = {
            currentResidence : currentResidence,
            pastResidence : pastResidence,
            mates : mates
        }
        console.log(result);
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.json(err);
    } 
});
router.put('/submit-review', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: /private/residence/submit-review', userid);
    const friendid = req.body.friendid;
    const review = req.body.review;
    try {
        await matesDB.addReview(userid,friendid,review);
    }
    catch (err) {
        console.log(err);
    }
})

router.put('/move-out', async (req, res) => {
    const userid = req.user.sub;
    const lid = parseInt(req.body.lid);
    //filter
    try {
        await filter.moveout(userid, lid);
    }
    catch(err) {
        console.log(err);
    }
    try {
        /**notify owner */
        const l = await listings.getListingByLid(lid);
        const data = {
            from: userid,
            to: l.owner,
            type: 'message',
            lid: lid,
            content: 'I have moved out from ' + l.address
        }
        await messages.addMessage(data);
        /**update mates */
        var mates = l.mates.split(" ");
        const len = mates.length;
        for (var i = 0 ; i < len; i ++) {
            if (mates[i] == userid) mates.splice(i,1);
        }
        mates = arrayToString(mates);
        await listings.updateMates(mates, lid);
    }
    catch(err) {
        console.log(err);
    }

});
function arrayToString(arr) {
    var s = '';
    for (var i = 0 ; i < arr.length; i ++) {
        if (i == 0) s = arr[0];
        else s += " " + arr[i];
    }
    return s;
}
function euclideanDistance(A, B) {
    var sum = 0;
    var maxDistance = 0;
    //arr = [userid, x, qid1, ...]
    for (var i = 1 ; i < Math.max(A.x,B.x); i ++) {
        if (!A['qid'+i] || !B['qid'+i]) sum += 16;
        else sum += Math.pow(A['qid'+i] - B['qid'+i], 2);//(a-b)^2
        maxDistance += 16;//(5-1)^2
    }
    var distance = Math.sqrt(sum);
    maxDistance = Math.sqrt(maxDistance);
    if (maxDistance == 0) return 0;
    const frac = (distance/maxDistance);//closer to zero the more similar
    return (1-frac)*100;
}
module.exports = router;