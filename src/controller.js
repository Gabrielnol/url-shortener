const {
  UrlService
} = require('./service')
  
class UrlController {
  constructor(req, res) {
    this.req = req
    this.res = res
  }

  async shortenUrl() {
    const { longUrl } = this.req.body
    const service = new UrlService({ longUrl })
    const shortUrl = await service.shortenUrl()
    return shortUrl
  }

  async redirectUrl() {
    const { shortCode } = this.req.params
    const service = new UrlService({ shortCode })
    const originalUrl = await service.getOriginalUrl()
    return originalUrl
  }
}

module.exports = {
  UrlController
}
