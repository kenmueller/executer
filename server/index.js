const { join } = require('path')
const { createServer } = require('http')
const express = require('express')
const { Server } = require('socket.io')

const PORT = process.env.PORT || '5000'
const ORIGIN = process.env.NODE_ENV === 'production'
	? 'https://executer.herokuapp.com'
	: `http://localhost:${PORT}`

const app = express()
const http = createServer(app)
const io = new Server({
	cors: { origin: ORIGIN }
})

app.use(express.static(join(__dirname, '../public')))

http.listen(PORT, () => {
	console.log(`Listening on ${ORIGIN}`)
})
