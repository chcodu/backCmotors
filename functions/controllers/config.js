var admin = require("firebase-admin");
var serviceAccount = require("../cwash-cd17c-firebase-adminsdk-38jw0-02bd00cfb7.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cwash-cd17c.firebaseio.com/",
  storageBucket: "gs://cwash-cd17c.appspot.com/"
  });

  var db = admin.database();

module.exports = {
  db
  };