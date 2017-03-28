const passport = require('passport')
const passportJWT = require('passport-jwt')
const userAPI = require('../data/user')
const cfg = require('../config/config')
const _ = require('lodash')

const ExtractJwt = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy

const params = {
  secretOrKey: cfg.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
}

module.exports = () => {
  const payloadStrategy = new Strategy(params, (payload, done) => {
    userAPI.validateToken(payload._id, (dataObject) => {
      return _.isEmpty(dataObject) === false ? done(null, dataObject) : done(null, { success: false })
    })
  })
  console.log('dentro da authenticate')
  passport.use(payloadStrategy)

  return {
    initialize: () => {
      return passport.initialize()
    },
    authenticate: () => {
      return passport.authenticate('jwt', cfg.jwtSession)
    }
  }
}
