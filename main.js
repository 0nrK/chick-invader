const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d");

canvas.width = window.innerWidth
canvas.height = window.innerHeight


class Player {
    constructor() {


        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0
        const image = new Image()
        image.src = "./assets/spaceship.png"

        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * scale
            this.height = image.width * scale

            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw() {

        /* c.fillRect(this.position.x, this.position.y, this.width, this.height) */

        c.save()

        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)

        c.rotate(this.rotation)

        c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)


        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)


        c.restore()
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Bullet {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;

        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 3)
        c.fillStyle = "red"
        c.fill()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}


class Enemy {
    constructor({ position }) {

        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image()
        image.src = "./assets/chicken.png"

        image.onload = () => {
            const scale = 0.08
            this.image = image
            this.width = image.width * scale
            this.height = image.width * scale

            this.position = {
                x: position.x,
                y: position.y
            }
        }

    }
    draw() {

        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )


    }

    update({ velocity }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y

        }
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }

        this.enemies = [
        ]


        this.width = 8 * 120

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 5; y++) {
                this.enemies.push(new Enemy({
                    position: {
                        x: x * 120,
                        y: y * 80
                    }
                }))
            }
        }
    }

    update() {
        this.position.x += this.velocity.x
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
        }
    }
}

const player = new Player()
const bullets = []
const grids = [new Grid()]

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    space: {
        pressed: false,
    }
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()


    bullets.forEach((bullet, index) => {

        if (bullet.position.y + bullet.radius <= 0) {
            setTimeout(() => {
                bullets.splice(index, 1)
            }, 0)
        } else {
            bullet.update()
        }
    })

    grids.forEach((grid) => {
        grid.update()
        grid.enemies.forEach((enemy, index) => {
            enemy.update({ velocity: grid.velocity })

            bullets.forEach((bullet, j) => {
                if (bullet.position.y - bullet.radius <= enemy.position.y + enemy.height && bullet.position.x + bullet.radius >= enemy.position.x && enemy.position.x - bullet.radius <= enemy.position.x && enemy.position.y + bullet.radius >= enemy.position.y) {
                    setTimeout(() => {

                        const enemyFound = grid.enemies.find((enemy2) => {
                            return enemy2 === enemy
                        })

                        const bulletFound = bullets.find(bullet2 => bullet2 = bullet)

                        if (enemyFound && bulletFound) {
                            grid.enemies.splice(index, 1)
                            bullets.splice(j, 1)
                        }

                    }, 0)
                }
            })
        })
    })

    if (keys.a.pressed && player.position.x >= 0) {
        player.rotation = -0.15
        player.velocity.x = -7.5
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 7.5
        player.rotation = 0.15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }


}

animate()

window.addEventListener(("keydown"), ({ key }) => {
    switch (key) {
        case "a":
            keys.a.pressed = true
            break
        case "d":
            keys.d.pressed = true
            break
        case " ":
            bullets.push(new Bullet({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }))
            keys.space.pressed = true
        default:
            break
    }
})

window.addEventListener(("keyup"), ({ key }) => {
    switch (key) {
        case "a":
            keys.a.pressed = false
            break
        case "d":
            keys.d.pressed = false
            break
        case " ":
            keys.space.pressed = false
        default:
            break
    }
})