class Thing {
    constructor(x, y, imageArray) {
        this.pos = createVector(x, y)
        this.dx = 0
        this.dy = 0

        this.anim = imageArray
        this.image = imageArray[0]
        this.animIndex = 0
        this.animSpeed = 0

        this.xDir = 1
        this.isDragging = false
        this.draggable = true
        this.dead = false
        this.visible = true
        this.mainDraw = true

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
            this.pos.x = mouseX
            this.pos.y = mouseY
        }

        if (!this.isDragging) {
            this.pos.x += this.xSpeed
            this.pos.y += this.ySpeed
            this.xSpeed *= 0.95
            this.ySpeed *= 0.95
        }
        else {
            this.xSpeed = 0
            this.ySpeed = 0
        }

        // animate thing
        this.animIndex += this.animSpeed
        if (this.animIndex >= this.anim.length) {
            this.animIndex = 0
        }
        this.image = this.anim[floor(this.animIndex)]
        return !this.dead
    }

    sprite() {
        image(this.image, floor(this.pos.x - this.image.width / 2 + this.dx + 0.5), floor(this.pos.y - this.image.height / 2 + this.dy + 0.5))
    }

    flipSprite() {
        push()
        translate(width, 0)
        scale(-1, 1)
        image(this.image, floor(width - this.pos.x - this.image.width / 2 - this.dx + 0.5), floor(this.pos.y - this.image.height / 2 - this.dy + 0.5))
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