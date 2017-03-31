const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const _ = require('lodash')

mongoose.connect('mongodb://localhost/docmob', err => {
  if (err) console.log(err)
})

const Schema = mongoose.Schema
const UserSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  email: String,
  password: String,
  active: Boolean,
  admin: Boolean,
  updatedAt: Date
})
const User = mongoose.model('users', UserSchema)

const WorkplaceSchema = new Schema({
  _id: Schema.Types.ObjectId,
  users: [
    { user: Schema.Types.ObjectId }
  ]
})
const Workplace = mongoose.model('workplaces', WorkplaceSchema)

const isValidUser = (email, password, callback) => {
  User.findOne({ email: { $eq: email }, active: true }, (err, doc) => {
    if (err) {
      console.log(err)
      callback({})
    }
    if (_.isEmpty(doc)) return callback({})
    // const compare = bcrypt.compareSync(password, doc.password)
    bcrypt.compare(password, doc.password).then(res => {
      console.log('validou a senha: ', res)
      if (res === false) return callback({})
      _getUserWorkplaces(doc._id, (workplaces) => {
        return callback({
          _id: doc._id,
          name: doc.name,
          email: doc.email,
          active: doc.active,
          admin: doc.admin,
          lastChangeDate: doc.updatedAt,
          workplaces: workplaces
        })
      })
    })
  })
}

const validateToken = (_id, callback) => {
  User.findOne({ _id: _id }, (err, doc) => {
    if (err) {
      console.log(err)
      callback({})
    }
    if (_.isEmpty(doc)) return callback({})
    if (doc.active === false) return callback({})
    return callback({
      success: true,
      _id: doc._id,
      lastChangeDate: doc.updatedAt
    })
  })
}

const getUserPayload = (_id, callback) => {
  User.findOne({ _id: _id }, (err, doc) => {
    if (err) {
      console.log(err)
      callback({})
    }
    if (_.isEmpty(doc)) return callback({})
    if (doc.active === false) return callback({})
    _getUserWorkplaces(doc._id, (workplaces) => {
      return callback({
        _id: doc._id,
        name: doc.name,
        email: doc.email,
        active: doc.active,
        admin: doc.admin,
        lastChangeDate: doc.updatedAt,
        workplaces: workplaces
      })
    })
  })
}

const _getUserWorkplaces = (userId, callback) => {
  Workplace.find({ users: { $elemMatch: { user: userId } } }, { name: 1 }, (err, doc) => {
    if (err) {
      console.log(err)
      callback([])
    }
    if (_.isEmpty(doc)) return callback([])
    callback(doc)
  })
}
module.exports = {
  isValidUser,
  getUserPayload,
  validateToken
}
