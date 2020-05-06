/**DEPENDENCIES */
const express = require('express');
const router = express.Router();
const listings = require('../db/table/listings')
const filter = require('../db/table/filter');
const matesDB = require('../db/table/mates');
const users = require('../db/table/users');
const messages = require('../db/table/messages')
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
        for (var i = 0 ; i < mates.length; i ++) {
            const temp = await users.getUsernameByUserid(mates[i].friendid);
            mates[i] = {id: mates[i], username: temp};
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
module.exports = router;