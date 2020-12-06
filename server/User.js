const users = new Set()

module.exports = class User {
	constructor(socket) {
		this.socket = socket
		this.x = socket.handshake.query.x
		this.y = socket.handshake.query.y
		
		this.initializeUsers()
		
		socket.on('location', (x, y) => {
			this.x = x
			this.y = y
			socket.to('/').emit('location', this.id, x, y)
		})
		
		socket.on('disconnect', () => {
			users.delete(this)
		})
	}
	
	get id() {
		return this.socket.id
	}
	
	initializeUsers = () => {
		this.socket.join('/')
		
		for (const user of users)
			this.socket.emit('location', user.id, user.x, user.y)
		
		users.add(this)
	}
}
