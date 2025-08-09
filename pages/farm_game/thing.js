class Thing {
    constructor(x, y, imageArray) {
        this.x = x
        this.y = y
        this.dx = 0
        this.dy = 0

        this.anim = imageArray
        this.image = imageArray[0]
        this.animIndex = 0
        this.animSpeed = 0

        this.xDir = 1
        this.isDragging = false
        this.draggingLastFrame = false
        this.draggable = true
        this.dead = false
        this.visible = true
        this.mainDraw = true
        this.expirable = false

        this.xSpeed = 0
        this.ySpeed = 0

        this.name = "thing"
    }

    update() {
        // manage dragging
        this.radius = this.image.width / 2
        if (!mouseIsPressed) {
            this.isDragging = false
        }
        if (this.isDragging) {
            this.x = mouseX
            this.y = mouseY
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

        // restrict thing to only the screen
        this.x = constrain(this.x, this.radius, GameWidth - this.radius)
        if (!this.isDragging) {
            this.y = constrain(this.y, this.radius, GameHeight - this.radius)
        }
        else {
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
        this.draggingLastFrame = this.isDragging
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
        image(this.image, floor(this.x - this.image.width / 2 + this.dx + 0.5), floor(this.y - this.image.height / 2 + this.dy + 0.5))
    }

    flipSprite() {
        push()
        translate(width, 0)
        scale(-1, 1)
        image(this.image, floor(width - this.x - this.image.width / 2 - this.dx + 0.5), floor(this.y - this.image.height / 2 - this.dy + 0.5))
        pop()
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

class Poop extends Thing {
    constructor(x, y, imageArray) {
        super(x, y, imageArray)
        this.name = "Poop"
    }
}