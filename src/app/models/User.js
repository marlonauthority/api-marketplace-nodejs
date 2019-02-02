const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')

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

// declarando metodos que cada instancia de user tenha
UserSchema.methods = {
  // comparando senha
  compareHash (password) {
    return bcrypt.compare(password, this.password)
  }
}

UserSchema.statics = {
  // pega o id do user
  generateToken ({ id }) {
    // retorna o token
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.ttl
    })
  }
}

module.exports = mongoose.model('User', UserSchema)
