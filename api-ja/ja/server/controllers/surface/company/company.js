const app = require('@server/server')
const service = require('@services/surface/company/company')


async function campaign(req, res) {
  try {
    res.json(await service.newCampaign())
  } catch (e) {
    res.sendStatus(e)
  }
}

async function campaignv2(req, res) {
  try {
    const isMobile = req.headers.platform == 'mobile'
    res.json(await service.campaignv2(isMobile))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function reviews(req, res) {
  try {
    res.json(await service.reviews())
  } catch (e) {
    res.sendStatus(e)
  }
}

async function spreads(req, res) {
  try {
    res.json(await service.spreads())
  } catch (e) {
    res.sendStatus(e)
  }
}

async function swaps(req, res) {
  try {
    res.json(await service.swaps())
  } catch (e) {
    res.sendStatus(e)
  }
}

async function present(req, res) {
  try {
    res.json(await service.present())
  } catch (e) {
    res.sendStatus(e)
  }
}

async function stocks(req, res) {
  try {
    res.json(await service.stocks())
  } catch (e) {
    res.sendStatus(e)
  }
}

async function bitcoin(req, res) {
  try {
    res.json(await service.bitcoin())
  } catch (e) {
    res.sendStatus(e)
  }
}

async function show(req, res) {
  try {
    res.json(await service.show(req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function review(req, res) {
  try {
    res.json(await service.review(
      req.params.id,
      app.utils.meta.meta(req, ['userId'])),
    )
  } catch (e) {
    res.sendStatus(e)
  }
}

async function postReview(req, res) {
  try {
    res.json(await service.postReview(
      req.params.id,
      req.body,
      app.utils.meta.meta(req, ['userId'])),
    )

  } catch (e) {
    res.sendStatus(e)
  }
}

async function companyUrls(req, res) {
  try {
    res.json(await service.companyUrls(req.query.ids || []))
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  campaign,
  campaignv2,
  reviews,
  spreads,
  swaps,
  present,
  stocks,
  bitcoin,
  show,
  review,
  postReview,
  companyUrls,
}
