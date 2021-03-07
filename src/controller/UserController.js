const { User } = require('./models')
const config = require("../../util/firebaseConfig")
const firebase = require("firebase")
const { validateSignupData, validateLoginData } = require("../../util/validators")

firebase.initializeApp(config)

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    }

    const { valid, errors } = validateSignupData(newUser)

    if (!valid) return res.status(400).json(errors)

    User.findAll({ where: { email: req.body.email } })
        .then(data => {
        if (data) {
            return res
            .status(400)
            .json({ handle: `This username is already taken` })
        } else {
            User.create({ 
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              bio : req.body.bio,
             })
            return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password)
        }
        })
        .then(data => data.user.getIdToken())
        .then(token => res.status(201).json({ token }))
        .catch(err => {
        console.error(err)
        if (err.code === "auth/email-already-in-use") {
            return res.status(400).json({ email: "Email is already in use" })
        } else {
            return res
            .status(500)
            .json({ general: "Something went wrong, please try again" })
        }
    })
}

exports.login = (req, res) => {
    const user = {
      email: req.body.email,
      password: req.body.password,
    }
  
    const { valid, errors } = validateLoginData(user)
  
    if (!valid) return res.status(400).json(errors)
  
    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(data => data.user.getIdToken())
      .then(token => res.json({ token }))
      .catch(err => {
        console.error(err)
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again" })
      })
  }