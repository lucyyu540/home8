/**DEPENDENCIES */
const express = require('express');
const router = express.Router();
const users = require('../db/table/users')
const listings = require('../db/table/listings')
const filter = require('../db/table/filter');
const personalityAs = require('../db/table/personalityAs');
const personalityQs = require('../db/table/personalityQs');
const messages = require('../db/table/messages');
const matesDB = require('../db/table/mates');
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**ACCEPT USER  */
router.put('/accept', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/listing/accept', userid);
    const lid = parseInt(req.body.lid);
    const mid = parseInt(req.body.mid);
    const from = req.body.from;
    const content = req.body.content.split(" ");
    //search in users
    try {
        var data = await listings.getListingByLid(lid);
        if (data.owner != userid) return res.end();//only owner can accept request
        console.log('verified owner of this listing');
        const r = await matesDB.addMates(from, data.owner);//friend owner
        console.log(r);
        console.log('added friends ');
        var mates = data.mates //get original mates
        if (mates) {
            /**friending each other */
            const matesArr = mates.split(" ");
            for (var i = 0 ; i < matesArr.length; i ++) {
                matesDB.addMates(from, matesArr[i]);
            }
            /**new string value */
            mates += " " + from; //request from mate
        }
        else mates = from;
        await listings.updateMates(mates, lid);//update listings mates
        console.log('mates added: ', mates);
        /**delete this space availability */
        var fromDate = data.fromDate.split(" ");
        var toDate = data.toDate.split(" ");
        var price = data.price.split(" ");
        var rooming = data.rooming.split(" ");
        var roomType = data.roomType.split(" ");
        var len = price.length;
        for (var i = 0 ; i < len; i ++) {
            if (fromDate[i] == content[0] && 
                toDate[i] == content[1] &&
                price[i] == content[2] &&
                rooming[i] == content[3] &&
                roomType[i] == content[4]) {
                    console.log('found splice index', i);
                    fromDate.splice(i,1);
                    toDate.splice(i,1);
                    price.splice(i,1);
                    rooming.splice(i,1);
                    roomType.splice(i,1);
                    break;
                }
        }
        if (price.length == 0) listings.deactivate(lid);
        data.fromDate = arrayToString(fromDate);
        data.toDate = arrayToString(toDate);
        data.price = arrayToString(price);
        data.rooming = arrayToString(rooming);
        data.roomType = arrayToString(roomType);
        await listings.updateSpace(data, lid);//update space
        console.log('space updated', data);
        await filter.movein(from, lid);//update filter
        console.log('filter table updated');
        await messages.deleteMessage(mid);//delete request 
        console.log('request message deleted');
        const message = {
            from: userid,
            to: from, //person who sent the request
            type: 'message',
            lid: lid,
            content: 'You have been added as a mate at ' + data.address +
            ' in the listed space,  ' + content[4] + ' ' + content[3] +            
            '. Go to My Homes page to access your residency details.'
        }
        await messages.addMessage(message);//send accept message
        console.log('request accept message sent');
        res.end();
    }
    catch (err) {
        console.log(err);  
        res.end();    
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