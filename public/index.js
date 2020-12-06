const SPEED = 3
const RADIUS = 20
const INITIAL_LOCATION = {
	x: window.innerWidth / 2,
	y: window.innerHeight / 2
}

const socket = io({ query: INITIAL_LOCATION })
const app = new PIXI.Application({
	width: window.innerWidth,
	height: window.innerHeight
})

document.body.append(app.view)

const newUser = (x, y) => {
	const user = new PIXI.Graphics()
	
	user.beginFill(0x000000)
	user.drawCircle(0, 0, RADIUS)
	user.endFill()
	
	user.vx = 0
	user.vy = 0
	
	user.x = x
	user.y = y
	
	return user
}

const addUser = user => {
	app.stage.addChild(user)
	return user
}

const user = addUser(newUser(INITIAL_LOCATION.x, INITIAL_LOCATION.y))
const users = {}

app.renderer.autoResize = true
app.renderer.backgroundColor = 0xffffff

const resize = () =>
	app.renderer.resize(window.innerWidth, window.innerHeight)

resize()
window.addEventListener('resize', resize)

window.addEventListener('keydown', ({ repeat, key }) => {
	if (repeat)
		return
	
	switch (key.toLowerCase()) {
		case 'w':
			user.vy--
			break
		case 'a':
			user.vx--
			break
		case 's':
			user.vy++
			break
		case 'd':
			user.vx++
			break
	}
})

window.addEventListener('keyup', ({ key }) => {
	switch (key.toLowerCase()) {
		case 'w':
			user.vy++
			break
		case 'a':
			user.vx++
			break
		case 's':
			user.vy--
			break
		case 'd':
			user.vx--
			break
	}
})

socket.on('location', (id, x, y) => {
	const user = users[id]
	
	if (!user) {
		addUser(users[id] = newUser(x, y))
		return
	}
	
	user.x = x
	user.y = y
})

app.ticker.add(() => {
	user.x += user.vx * SPEED
	user.y += user.vy * SPEED
	
	if (user.vx || user.vy)
		socket.emit('location', user.x, user.y)
})
