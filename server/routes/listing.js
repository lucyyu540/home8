/**DEPENDENCIES */
const express = require('express');
const router = express.Router();
const users = require('../db/table/users')
const listings = require('../db/table/listings')
const filter = require('../db/table/filter');
const personalityAs = require('../db/table/personalityAs');
const personalityQs = require('../db/table/personalityQs');
const messages = require('../db/table/messages');
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**ACCEPT USER  */
router.put('/decline', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/listing/decline', userid);
    const mid = parseInt(req.body.mid);
    try {
        await messages.deleteMessage(mid);
    }
    catch (err) {
        console.log(err);
        res.end();
    }
});

router.put('/accept', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/listing/accept', userid);
    const lid = parseInt(req.body.lid);
    const mid = parseInt(req.body.mid);
    //search in users
    try {
        var mates = await listings.getMatesByLid(lid); //get original mates
        mates += " " + req.body.from; //add mate
        await listings.updateMates(mates, lid);//update listings mates
        var data = await listings.getSpaceByLid(lid);//get original space
        /**delete this space availability */
        var fromDate = data.fromDate.split(" ");
        var toDate = data.toDate.split(" ");
        var price = data.price.split(" ");
        var rooming = data.rooming.split(" ");
        var roomType = data.roomType.split(" ");
        const content = req.body.content.split(" ");
        for (var i = 0 ; i < price.length; i ++) {
            if (fromDate[i] == content[0] && 
                toDate[i] == content[1] &&
                price[i] == content[2] &&
                rooming[i] == content[3] &&
                roomType[i] == content[4]) {
                    data.fromDate = data.fromDate.split(" ").splice(i,1);
                    data.toDate = data.toDate.split(" ").splice(i,1);
                    data.price = data.price.split(" ").splice(i,1);
                    data.rooming = data.rooming.split(" ").splice(i,1);
                    data.roomType = data.roomType.split(" ").splice(i,1);
                }
        }
        data.fromDate = arrayToString(data.fromDate);
        data.toDate = arrayToString(data.toDate);
        data.price = arrayToString(data.price);
        data.rooming = arrayToString(data.rooming);
        data.roomType = arrayToString(data.roomType);
        await listings.updateSpace(data, lid);//update space
        await filter.movein(req.body.from, lid);//update filter
        await messages.deleteMessage(mid);//delete request 
        const message = {
            from: userid,
            to: req.body.from, //person who sent the request
            type: 'message',
            lid: lid,
            content: 'You have been added as a resident. Go to my roomings to access your residency details.'
        }
        await messages.addMessage(message);//send accept message
        console.log(result);
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