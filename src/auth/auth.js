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
  const strategy = new Strategy(params, (payload, done) => {
    userAPI.getUserPayload(payload._id, (dataObject) => {
      console.log('dentro do callback')
      return _.isEmpty(dataObject) === false ? done(null, dataObject) : done(null, { success: false })
    })
  })

  passport.use(strategy)

  return {
    initialize: () => {
      return passport.initialize()
    },
    authenticate: () => {
      console.log('dentro da authenticate')
      return passport.authenticate('jwt', cfg.jwtSession)
    }
  }
}
