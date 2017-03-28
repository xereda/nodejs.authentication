const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jwt-simple')
const _ = require('lodash')
const auth = require('./src/auth/auth')()
const userAPI = require('./src/data/user')
console.log('userAPI', userAPI)
const cfg = require('./src/config/config')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(auth.initialize())

app.get('/', (req, res) => {
  res.json({ status: 'My API is live!' })
})

app.get('/usuarios', auth.authenticate(), (req, res) => {
  if (req.user.success === false) return res.sendStatus(401)
  res.json(req.user)
})

app.post('/token', (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  if (_.isEmpty(email) && _.isEmpty(password)) {
    res.sendStatus(401)
    return next()
  }
  userAPI.isValidUser(email, password, (user) => {
    if (_.isEmpty(user)) {
      res.sendStatus(401)
      return next()
    }
    const payload = {
      _id: user,
      exp: new Date() / 1000 + cfg.expirate
    }
    const token = jwt.encode(payload, cfg.jwtSecret)
    res.json({ token })
  })
})

app.listen(3000, () => {
  console.log('My API is running...')
})

module.exports = app
