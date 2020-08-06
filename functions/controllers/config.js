var admin = require("firebase-admin");
var serviceAccount = require("api key firebase database");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cwash-cd17c.firebaseio.com/",
  storageBucket: "gs://cwash-cd17c.appspot.com/"
  });

  var db = admin.database();

module.exports = {
  db
  };
