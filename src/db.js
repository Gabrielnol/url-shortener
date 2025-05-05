const { Pool } = require('pg')

const pool = new Pool({
    host:     process.env.PG_HOST,
    port:     process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user:     process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    max:      10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })

  module.exports = {
    query: (text, params) => pool.query(text, params)
  }
  