const admin = require("firebase-admin")

const credentials = require('./credentials.json')

admin.initializeApp({
    credential: admin.credential.cert(credentials),
    databaseURL: 'https://cmd-f-2021.firebaseio.com'
})

const db = admin.firestore()

module.exports = { admin, db }