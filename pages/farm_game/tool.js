class Menu {
    constructor() {
        this.x = 0
        this.y = GameHeight
        this.width = GameWidth
        this.height = height - GameHeight

        this.wallet = 0

        this.scooper = CreateThing(new Scooper(this.x + 150, this.y + 50))
        this.scooperShadow = loadImage('imgs/scooperShadow1.png')
        this.bin = CreateThing(new Bin(this.x + 50, this.y + 60))
    }

    draw() {
        push()
        noStroke()
        fill(255, 200, 200)
        rect(this.x, this.y, this.width, this.height)
        pop()

        push()
        textAlign(RIGHT, CENTER);
        text("$" + this.wallet, this.width - 50, this.y + this.height / 2)
        pop()

        /* Shadows */
        blendMode(OVERLAY)
        image(this.scooperShadow, this.scooper.originalX - 32, this.scooper.originalY - 32)
        blendMode(BLEND)
    }

    addMoney(amount) {
        if (amount > 0) {
            this.wallet += amount
            soldSound()
        }
    }
}

class Tool extends Thing {
    constructor(x, y, imageArray) {
        super(x, y, imageArray)
        this.restrictPositionToGame = false

        this.originalX = this.x
        this.originalY = this.y
    }

    update() {
        super.update()
        if (!this.isDragging && this.isDraggingLastFrame) {
            this.x = this.originalX
            this.y = this.originalY
        }
        return !this.dead
    }
}

class Scooper extends Tool {
    constructor(x, y) {
        super(x, y, [loadImage('imgs/scooper1.png'), loadImage('imgs/scooper2.png')])
        this.name = "Scooper"

        this.dragOffsetX = -15
        this.dragOffsetY = 15

        this.poopCount = 0
        this.collectedValue = 0
    }

    update() {
        super.update()

        if (this.isDragging) {
            let coll = this.collisionObject("Poop")
            if (coll !== null) {
                console.log("scoop")
                coll.dead = true
                this.poopCount += 1
                this.collectedValue += coll.value
                poopScoopedSound()
            }

            coll = this.collisionObject("Bin")
            if (coll !== null) {
                console.log("binned")
                menu.addMoney(this.collectedValue)
                this.poopCount = 0
                this.collectedValue = 0
            }
        }

        if (this.poopCount > 0) {
            this.image = this.anim[1]
        } else {
            this.image = this.anim[0]
        }

        return !this.dead
    }

}

class Bin extends Tool {
    constructor(x, y) {
        super(x, y, [loadImage('imgs/unknown1.png')])
        this.name = "Bin"

        this.draggable = false
    }

    update() {
        super.update()

        return !this.dead
    }
}