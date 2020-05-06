/**DEPENDENCIES */
const express = require('express');
const router = express.Router();
const users = require('../db/table/users')
const listings = require('../db/table/listings')
const filter = require('../db/table/filter');
const messages = require('../db/table/messages');
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**SEND REQUEST */
router.put('/request', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/notification/request', userid);
    const content = req.body.fromDate + ' '+ req.body.toDate + ' '+ req.body.price + ' '+ req.body.rooming + ' '+ req.body.roomType;
    const data = {
        from: userid,
        to : req.body.to,
        type: 'request',
        lid : parseInt(req.body.lid), 
        content: content,
    }
    //search in users
    try {
        const result = await messages.addMessage(data);
        res.json(result);
    }
    catch (err) {
        console.log(err);      
    }
})
/**SEND MESSAGES */
router.put('/message', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/notification/message', userid);
    const data = {
        from: userid,
        to : req.body.to,
        type: 'message',
        lid: null,
        content: req.body.content,
    }
    //search in users
    try {
        const result = await messages.addMessage(data);
        res.json(result);
    }
    catch (err) {
        console.log(err);      
    }
})
/** mark as read */
router.put('/read', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/notification/read', userid);
    console.log('read mid', req.body.unreadMid);
    try {
        const result = await messages.readMessage(req.body.unreadMid, userid);
        res.json(result);
    }
    catch (err) {
        console.log(err);
    }
})
router.put('/inbox/delete', async (req, res) => {
    console.log('endpoint: private/notification/inbox/delete');
    const mid = parseInt(req.body.mid);
    try {
        await messages.deleteMessage(mid);
        res.end();
    }
    catch (err) {
        console.log(err);
        res.end();
    }
})
/************************************************************************* */
/**ALL REQUESTS SENT BY USER */
router.get('/outbox/requests', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/notification/outbox/requests', userid);
    try {
        const results = await messages.getSentRequests(userid);
        res.json(results);
    }
    catch(err) {
        console.log(err);
    }

})
/******************************************************************************* */
router.get('/inbox/unread', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/notification/inbox/unread', userid);
    try{
        const results = await messages.getUnread(userid);
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
    console.log('endpoint: private/notification/inbox', userid);
    var convo = {};
    try {
        /**ALL SENT AND RECEIVED */
        const results = await messages.getAll(userid);
        for (var i = results.length-1; i >= 0; i --) {//most recent first
            /**convert userid -> username */
            console.log(results[i]);
            if (results[i].from == userid) {
                results[i].from = [results[i].from, 'You'];
                if (results[i].type == 'request') continue;//dont show for requests sent
            }
            else {
                const from = await users.getUsernameByUserid(results[i].from);
                results[i].from = [results[i].from, from];
            }
            if (results[i].to == userid) results[i].to = [results[i].to, 'You'];
            else {
                const to = await users.getUsernameByUserid(results[i].to);
                results[i].to = [results[i].to, to];
            }   
            /**sort into conversations */
            var unique;
            if (results[i].from == userid) unique = results[i].to[1];
            else unique = results[i].from[1];
            if (! convo[unique]) {//unique
                convo[unique] = [results[i]];
            }
            else convo[unique].push(results[i]);
        }
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
module.exports = router;