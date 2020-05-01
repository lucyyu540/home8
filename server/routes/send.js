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
        lid: null,
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
router.put('/read', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/send/read', userid);
    console.log('read mid', req.body.unreadMid);
    try {
        const result = await messages.readMessage(req.body.unreadMid);
        console.log(result);
        res.json(result);
    }
    catch (err) {
        console.log(err);
    }
})
/************************************************************************* */
/**ALL REQUESTS SENT BY USER */
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
/******************************************************************************* */
router.put('/inbox/delete', async (req, res) => {
    console.log('endpoint: private/inbox/delete');
    const mid = req.body.mid;
    try {
        const result = await messages.deleteMessage(mid);
        console.log(result);
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.json(err);
    }
})
router.get('/inbox/unread', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/inbox/unread', userid);
    try{
        const results = await messages.getUnread(userid);
        console.log(results);
        res.json(results);
    }
    catch(err) {
        console.log(err);
        res.json(err);
    }
})
/**LIST ALL REQUESTS AND CONVERSATIONS */
router.get('/inbox', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/send/inbox', userid);
    var convo = {};
    try {
        /**ALL SENT AND RECEIVED */
        const results = await messages.getAll(userid);
        for (var i = results.length-1; i >= 0; i --) {//most recent first
            /**convert userid -> username */
            if (results[i].from == userid) results[i].from = [results[i].from, 'You'];
            else {
                const from = await users.getUsernameByUserid(results[i].from);
                results[i].from = [results[i].from, from];
            }
            if (results[i].to == userid) results[i].to = [results[i].to, 'You'];
            else {
                const to = await users.getUsernameByUserid(results[i].to);
                results[i].to = [results[i].to, to];
            }   
            var unique;
            if (results[i].from == userid) unique = results[i].to[1];
            else unique = results[i].from[1];
            if (! convo[unique]) {//unique
                convo[unique] = [results[i]];
            }
            else convo[unique].push(results[i]);
        }
        console.log(convo);
        res.json(convo);
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