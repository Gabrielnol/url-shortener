const { v4: uuidv4 } = require('uuid')
const db = require('./db')
class UrlService {
  constructor({longUrl, shortCode}) {
    this.longUrl = longUrl
    this.shortCode = shortCode
  }

  async shortenUrl() {
    const sql = `SELECT id, expires_at, short_url_code FROM tb_short_long_url tslu where tslu.long_url = $1;`
    const { rows } = await db.query(sql, [this.longUrl])
    if (rows.length) {
      const expirationDate = (rows[0].expires_at)
      if(expirationDate > new Date(Date.now())) {
        throw new Error(`A shortened link for this url already exists: http://localhost:${process.env.PORT}/${rows[0].short_url_code}`)
      } else {
        await this.deleteOldShortenedUrl(rows[0].id)
        return await this.createNewShortenedUrl()
      }
    } else {
      return await this.createNewShortenedUrl()
    }
  }

  async deleteOldShortenedUrl(urlId) {
    const sql = `DELETE FROM tb_short_long_url tslu where tslu.id = $1;`
    await db.query(sql, [urlId])
  }

  async createNewShortenedUrl() {
    const uuid = uuidv4().split('-')[4]
    const expires_at = new Date(Date.now() + 3600_000)
    const sql = `INSERT INTO tb_short_long_url(short_url_code, long_url, expires_at) VALUES($1,$2,$3) RETURNING *;`
    await db.query(sql, [uuid, this.longUrl, expires_at])
    return {
      shortenedUrl: `http://localhost:${process.env.PORT}/${uuid}`,
    }
  }

  async getOriginalUrl() {
    const sql = `SELECT long_url, expires_at FROM tb_short_long_url tslu where tslu.short_url_code = $1;`
    const { rows } = await db.query(sql, [this.shortCode])
    if(!rows.length) throw new Error('This shortened url does not exist!')
    if((rows[0].expires_at) < new Date(Date.now())) throw new Error('This shortened url has already expired! Create a new shortened url for this link')
    return rows[0].long_url
  }
}

module.exports = {
  UrlService
}
