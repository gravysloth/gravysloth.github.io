class Thing {
    constructor(x, y, imageArray) {
        this.x = x
        this.y = y
        this.name = "thing"

        /** Position and speed */
        this.xDir = 1
        this.dx = 0
        this.dy = 0
        this.xSpeed = 0
        this.ySpeed = 0

        /** Animation and visuals */
        this.anim = imageArray
        this.image = imageArray[0]
        this.animIndex = 0
        this.animSpeed = 0
        this.imageOffsetX = 0
        this.imageOffsetY = 0

        /** Statuses and definitions */
        this.dead = false
        this.visible = true
        this.mainDraw = true

        /** Dragging */
        this.isDragging = false
        this.isDraggingLastFrame = false
        this.draggable = true
        this.restrictPositionToGame = true
        this.dragOffsetX = 0
        this.dragOffsetY = 0

        /** Expiration */
        this.expirable = false
        this.expirationTimer = 0
        this.fastestAnimSpeed = 0
        this.flashStartTime = 0
        this.expiring = false
    }

    update() {
        // manage dragging
        this.radius = this.image.width / 2
        if (!mouseIsPressed) {
            this.isDragging = false
        }
        if (this.isDragging) {
            this.x = mouseX + this.dragOffsetX
            this.y = mouseY + this.dragOffsetY
        }

        if (!this.isDragging) {
            this.x += this.xSpeed
            this.y += this.ySpeed
            this.xSpeed *= 0.95
            this.ySpeed *= 0.95
        }
        else {
            this.xSpeed = 0
            this.ySpeed = 0
        }

        // expiration
        if (this.expirable) {
            this.expirationHandling()
        }

        // restrict thing to only the screen
        this.x = constrain(this.x, this.radius, GameWidth - this.radius)
        if (this.restrictPositionToGame && !this.isDragging) {
            this.y = constrain(this.y, this.radius, GameHeight - this.radius)
        } else {
            this.y = constrain(this.y, this.radius, height - this.radius)
        }

        // animate thing
        this.animIndex += this.animSpeed * deltaTime / secondsToMs
        if (this.animIndex >= this.anim.length) {
            this.animIndex = 0
        }
        this.image = this.anim[floor(this.animIndex)]

        return !this.dead
    }

    finishUpdate() {
        this.isDraggingLastFrame = this.isDragging
    }

    collision() {
        for (let i = 0; i < ThingList.length; i++) {
            let test = ThingList[i]
            if (dist(thing.x, thing.y, this.x, this.y) <= thing.radius + this.radius && this !== thing) {
                return thing
            }
        }

        return null
    }

    collisionObject(thing) {
        for (let i = 0; i < ThingList.length; i++) {
            let test = ThingList[i]

            if (dist(test.x, test.y, this.x, this.y) <= test.radius + this.radius
                && this !== test
                && test.name.localeCompare(thing) == 0) {
                return test
            }
        }

        return null
    }

    collisionObjectAt(x, y, thing, radius) {
        for (let i = 0; i < ThingList.length; i++) {
            let test = ThingList[i]

            if (dist(test.x, test.y, x, y) <= radius
                && this !== test
                && test.name.localeCompare(thing) == 0) {
                return test
            }
        }

        return null
    }

    sprite() {
        image(this.image, floor(this.x - this.image.width / 2 + this.dx + 0.5 + this.imageOffsetX), floor(this.y - this.image.height / 2 + this.dy + 0.5 + this.imageOffsetY))
    }

    flipSprite() {
        push()
        translate(width, 0)
        scale(-1, 1)
        image(this.image, floor(width - this.x - this.image.width / 2 - this.dx + 0.5 - this.imageOffsetX), floor(this.y - this.image.height / 2 - this.dy + 0.5 - this.imageOffsetY))
        pop()
    }

    expirationHandling() {
        if (this.expiring) {
            this.expirationTimer -= deltaTime
            this.animSpeed = max(0, this.fastestAnimSpeed - (this.fastestAnimSpeed / this.flashStartTime * this.expirationTimer))
            if (this.expirationTimer <= 0) {
                this.dead = true
            }
        }

    }

    draw() {
        if (this.xDir == 1) {
            this.sprite()
        }
        else {
            this.flipSprite()
        }
    }
}

/* ------- ALL OTHER CLASSES ------- */

class Sellable extends Thing {
    constructor(x, y, imageArray) {
        super(x, y, imageArray)
        this.value = 0
    }

    sold() {
        menu.addMoney(this.value)
    }
}

class Poop extends Sellable {
    constructor(x, y, imageArray) {
        super(x, y, imageArray)
        this.expirable = true
        this.expirationTimer = 20 * secondsToMs
        this.fastestAnimSpeed = 0
        this.flashStartTime = 5 * secondsToMs
        this.expiring = true
        this.value = 1

        this.name = "Poop"
    }
}