/**DEPENDENCIES */
const express = require('express');
const router = express.Router();
const users = require('../db/table/users')

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
router.get('/',  (req,res) => {
    console.log('client traveled to endpoint /');
    res.json('loading listings');
    //res.send(req.isAuthenticated() ? "Logged in" : "Logged out").end();
})
/**PROFILE GIVEN USERNAME */
router.put('/:username', async (req, res) => {
    console.log('endpoint: /'+ req.params.username);
    //search in users
    try {
        const results = await users.getProtectedUserByUsername(req.params.username);
        console.log(results[0]);
        res.json(results[0]).end();
    }
    catch (err) {
        console.log(err);
        console.log('user DNE in mysql');
    }
    //return favorited listings
    
    //else if not found, create new user in users
    //res.json('/users page for listings')

})
module.exports = router;