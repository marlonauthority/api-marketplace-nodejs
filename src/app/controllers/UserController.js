const User = require('../models/User')

class UserController {
  async store (req, res) {
    // busca email da requisicao
    const { email } = req.body
    // se existe email retorna http 400 error bad request
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // se nao retornar erro cria usuario
    const user = await User.create(req.body)

    return res.json(user)
  }
}
module.exports = new UserController()
