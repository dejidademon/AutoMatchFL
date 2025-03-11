var admin = require("firebase-admin");

var serviceAccount = require("./service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://automatch-64fd2-default-rtdb.firebaseio.com"
});

module.exports = admin;