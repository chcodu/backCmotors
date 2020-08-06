const functions = require('firebase-functions');
var app = require('./api');


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions


exports.api = functions.https.onRequest(app);