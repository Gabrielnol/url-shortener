const express = require('express')
const app = express()
const { PORT } = process.env
const {
	UrlController
} = require('./controller')

app.use(express.json())

app.listen(PORT, () => {
	console.log('Server is up and running!')
})

app.post('/shorten', async (req, res) => {
	const controller = new UrlController(req, res)
	res.json(await controller.shortenUrl())
})

app.get('/:shortCode', async (req, res) => {
	const controller = new UrlController(req, res)
	res.redirect(await controller.redirectUrl())
})
