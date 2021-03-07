const { User, UserHabits, HabitTypes, Habit } = require('../models/index')
const config = require("../../util/firebaseConfig")
const { admin } = require('../../util/admin')
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
    const expiresIn = 60 * 60 * 24 * 5 * 1000

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
        }})
        .then(data => data.user.getIdToken())
        .then(token => admin.auth().createSessionCookie(token, { expiresIn }))
        .then(sessionCookie => { // sessionCookie is the token
          console.log(sessionCookie)
          const options = { maxAge: expiresIn, httpOnly: true, secure: true }
          res.cookie('session', sessionCookie, options)
          return res.status(201).json({ status: 'Success' })
        })
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

  exports.getUser = (req, res) => 
    User.findAll({ where: { id: req.params.user_id }, limit: 1 }).then(res.json).catch(console.error)

  exports.getUsers = (req, res) => {
    User.findAll().then(res.json).catch(console.error)
  }

  exports.getUserHabits = (req, res) => 
    User.findAll({
      where: { userId: req.params.user_id }
    })
    .then(res.json)
    .catch(err => {
      console.error(err)
      res.status(400).json({message: `Something went wrong at getting User Habits: ${err}`})
    })
  
  exports.postUserHabit = (req, res) => {
    const ownerId = UserHabit.findOne({
      attributes: ['ownerId'],
      where: { user_id: ownerId, habitId: req.body.habitId }
    })

    UserHabits.create({
      userId: req.params.user_id,
      ownerId,
      habitId: req.body.habitId,
      currentDuration: req.body.currentDuration,
      endDuration: req.body.endDuration
    })
    .then(res.json)
    .catch(err => {
      console.error(err)
      res.status(400).json({message: `Something went wrong at posting UserHabit: ${err}`})
    })
  }

  exports.postNewHabit = (req, res) => {
    Habit.create({
      name: req.body.name,
      description: req.body.description,
      endDuration: req.body.endDuration,
      habitTypeId: req.body.habitTypeId
    })
    .then(habit => 
      UserHabits.create({
        userId: req.params.user_id,
        ownerId: req.params.user_id,
        habitId: habit.id,
        currentDuration: req.body.currentDuration,
        endDuration: req.body.endDuration
      })
    )
    .then(res.json)
    .catch(err => {
      console.error(err)
      res.status(400).json({message: `Something went wrong at posting a new habit: ${err}`})
    })
  }