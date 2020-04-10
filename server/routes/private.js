/**DEPENDENCIES */
const express = require('express');
const router = express.Router();
const users = require('../db/table/users')
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
router.put('/',  async (req,res) => {
    console.log(req.user);
    const email = req.user['https://home8-api.com/email'];
    const username = req.user['https://home8-api.com/username'];
    const userid = req.user.sub;
    console.log(req.user.sub)
    console.log('endpoint: /private ', email, username);
    //search in users
    try {
        const results = await users.getUserByUserid(userid);
        console.log(results[0]);
        res.json(results[0]).end();
    }
    catch (err) {
        console.log('user DNE in mysql');
        try {
            const results = await users.createNewUser(userid, email, username);
            console.log('inserted user in mysql');
            console.log(results[0]);
            res.json(results[0]).end();
            
        }
        catch (err) {
            console.log('error in inserting new user');
            res.json('user DNE and failed to insert in mysql').end()
        }
    }
    //return favorited listings
    
    //else if not found, create new user in users
    //res.json('/users page for listings')

})
/**PROFILE GIVEN USERNAME */
router.put('/my-profile', async (req, res) => {
    const userid = req.user.sub;
    console.log('endpoint: private/my-profile');
    //search in users
    try {
        const results = await users.getUserByUserid(userid);
        console.log(results[0]);
        res.json(results[0]).end();
    }
    catch (err) {
        console.log(err);
        console.log('user DNE in mysql');
        res.json(err);
    }
    //return favorited listings
    
    //else if not found, create new user in users
    //res.json('/users page for listings')

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
module.exports = router;