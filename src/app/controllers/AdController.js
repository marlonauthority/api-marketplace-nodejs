const Ad = require('../models/Ad')

class AdController {
  async index (req, res) {
    // filtros
    const filters = {}
    // caso exista preco max ou min
    if (req.query.price_min || req.query.price_max) {
      filters.price = {}
      // caso tenha preco minimo mostre preco minimo
      if (req.query.price_min) {
        filters.price.$gte = req.query.price_min
      }
      // caso tenha preco max mostre preco max
      if (req.query.price_max) {
        filters.price.$lte = req.query.price_max
      }
    }
    // filtro nomes
    if (req.query.title) {
      // regexp busca em qualquer lugar com case sensitive
      filters.title = new RegExp(req.query.title, 'i')
    }

    // Busca todos ads
    const ads = await Ad.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      populate: ['author'],
      sort: '-createdAt'
    })
    return res.json(ads)
  }
  async show (req, res) {
    // Busca pelo id
    const ad = await Ad.findById(req.params.id)
    return res.json(ad)
  }
  async store (req, res) {
    // cria pegando os paramentros da requisicao req.body e tambem o userid
    // o userid vem la do middlware auth
    const ad = await Ad.create({ ...req.body, author: req.userId })
    return res.json(ad)
  }
  async update (req, res) {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    // o uso do new:true serve para retornar-mos as informacoes ja att
    return res.json(ad)
  }
  async destroy (req, res) {
    await Ad.findByIdAndDelete(req.params.id)
    return res.send()
  }
}

module.exports = new AdController()
