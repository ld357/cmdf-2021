const admin = require("firebase-admin")

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://cmd-f-2021.firebaseio.com'
})

const db = admin.firestore()

module.exports = { admin, db }