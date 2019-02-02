const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  // 1- Buscamos no cabecalho da requisicao o token
  const authHeader = req.headers.authorization
  // 2 - Verficamos se existe caso contrario retorna erro
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  // 3- separamos o bearer do token
  const [, token] = authHeader.split(' ')

  // 4 verificamos se o token é valido
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)
    // insere o id vindo da requisicao token ficando global
    req.userId = decoded.id
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Token Invalid' })
  }
}
