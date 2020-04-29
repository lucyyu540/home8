/**DEPENDENCIES */
const express = require('express');
const router = express.Router();
const users = require('../db/table/users')
const listings = require('../db/table/listings')
const favoriteListings = require('../db/table/favoriteListings');
const personalityAs = require('../db/table/personalityAs');
const personalityQs = require('../db/table/personalityQs');
const messages = require('../db/table/messages');
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**SEND REQUEST */
router.put('/request', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/send/request', userid);
    const content = req.body.fromDate + ' '+ req.body.toDate + ' '+ req.body.price + ' '+ req.body.rooming + ' '+ req.body.roomType
    const data = {
        from: userid,
        to : req.body.to,
        type: 'request',
        lid : parseInt(req.body.lid),
        content: content,
    }
    console.log(data);
    //search in users
    try {
        const result = await messages.addMessage(data);
        console.log(result);
        res.json(result);
    }
    catch (err) {
        console.log(err);      
    }
})
/**SEND MESSAGES */
router.put('/message', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/send/message', userid);
    const data = {
        from: userid,
        to : req.body.to,
        type: 'message',
        lid : parseInt(req.body.lid),
        content: req.body.content,
    }
    console.log(data);
    //search in users
    try {
        const result = await messages.addMessage(data);
        console.log(result);
        res.json(result);
    }
    catch (err) {
        console.log(err);      
    }
})
/**ALL REQUESTS BY USER */
router.get('/outbox/requests', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/send/outbox/requests', userid);
    try {
        const results = await messages.getSentRequests(userid);
        console.log(results);
        res.json(results);
    }
    catch(err) {
        console.log(err);
    }

})

/**LIST ALL REQUESTS AND CONVERSATIONS */
router.get('/inbox', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/send/inbox', userid);
    var from = {};
    var data = {
        requests: [],
        conversations: []
    }
    try {
        /**ALL REQUESTS RECEIVED */
        var results = await messages.getReceivedRequests(userid);
        for (var i = results.length-1; i >= 0; i ++) {//most recent first
            /**convert userid -> username */
            const from = await users.getUsernameByUserid(results[i].from);
            results[i].from = [results[i].from, from];
            data.requests.push(results[i]);
        }
        /**ALL MESSAGES SENT AND RECEIVED */
        results = await messages.getMessages(userid);
        for (var i = results.length-1; i >= 0; i ++) {//most recent first
            /**convert userid -> username */
            const from = await users.getUsernameByUserid(results[i].from);
            results[i].from = [results[i].from, from];
            data.requests.push(results[i]);
            if (! from[results[i].from[0]]) {//unique
                data.conversations.push(results[i]);
                from[results[i].from[0]] = results[i].from[0];
            }
        }
        console.log(data);
        res.json(data);
    }
    catch (err) {
        console.log(err);
    }
})



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