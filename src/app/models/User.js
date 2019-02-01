const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
// hook -> antes de salvar
UserSchema.pre('save', async function (next) {
  // se no campo password nao foi modificado nao faca nada
  if (!this.isModified('password')) {
    return next()
  }
  // se caso foi criptografe usando forca de senha 8
  this.password = await bcrypt.hash(this.password, 8)
})

module.exports = mongoose.model('User', UserSchema)
