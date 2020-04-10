/**DEPENDENCIES */
const AWS = require('aws-sdk');
const fs = require('fs'); //read files from computer
require('dotenv').config({path:__dirname+'/./../.env'});//config username and password hiding
//config
AWS.config.update({region: 'us-west-2'});
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//initialize s3 interface by passing access keys
const s3 = new AWS.S3({
    accessKeyId: process.env.ADMIN_ACCESS_KEY,
    secretAccessKey: process.env.ADMIN_SECRET_ACCESS_KEY
});
//create bucket
const params = {
    Bucket: 'home8',
    CreateBucketConfiguration: {
        // Set your region here
        LocationConstraint: "us-west-2"
    }
};
/**
s3.createBucket(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Bucket Created Successfully', data.Location);
});
*/

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/** QUERIES */
const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: 'test-bucket',
        Key: 'cat.jpg', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

//module.exports =