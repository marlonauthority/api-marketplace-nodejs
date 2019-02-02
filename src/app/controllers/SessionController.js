const User = require('../models/User')

class SessionController {
  async store (req, res) {
    // buscando email e senha
    const { email, password } = req.body
    // pegar o user
    const user = await User.findOne({ email })
    // se nao encontrar o usuario
    if (!user) {
      return res.status(400).json({ error: 'Usuario não existe' })
    }

    if (!(await user.compareHash(password))) {
      return res.status(400).json({ error: 'Senha Incorreta' })
    }
    // aqui retorna o json com o usuario e o token
    return res.json({ user, token: User.generateToken(user) })
  }
}
module.exports = new SessionController()
