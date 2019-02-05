const Ad = require('../models/Ad')
const User = require('../models/User')
const Mail = require('../services/Mail')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    // encontrar anuncio
    const purchaseAd = await Ad.findById(ad).populate('author')
    // buscar info do usuario logado
    const user = await User.findById(req.userId)

    // enviar email
    await Mail.sendMail({
      from: '"Marlon Authority" <marlon_authority@msn.com>',
      to: purchaseAd.author.email,
      subject: `Solicitacao de compra: ${purchaseAd.title}`,
      template: 'purchase',
      context: { user, content, ad: purchaseAd }
    })
    return res.send()
  }
}

module.exports = new PurchaseController()
