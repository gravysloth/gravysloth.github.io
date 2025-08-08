class Plant extends Thing {
    constructor(x, y, imageArray) {
        super(x, y, imageArray)
        this.fruits = []
    }

    update() {
        super.update()
        return !this.dead
    }

    draw() {
        super.draw()
        for (let i = 0; i < this.fruits.length; i++) {
            this.fruits[i].draw()
        }
    }
}

class Fruit extends Thing {
    constructor(x, y, imageArray, plant, index) {
        super(plant.pos.x + x, plant.pos.y + y, imageArray)
        this.plant = plant
        this.index = index

        this.dX = this.pos.x - this.plant.pos.x
        this.dY = this.pos.y - this.plant.pos.y

        this.expirationTimer = 10 * ms
        this.fastestAnimSpeed = 0.3
        this.flashStartTime = 5 * ms

        this.mainDraw = false
        this.picked = false
        this.draggingLastFrame = false
    }

    update() {
        super.update()

        if (this.isDragging) {
            this.dX = this.pos.x - this.plant.pos.x
            this.dY = this.pos.y - this.plant.pos.y
        } else {
            this.pos.x = this.plant.pos.x + this.dX
            this.pos.y = this.plant.pos.y + this.dY
        }

        if (!this.isDragging && this.draggingLastFrame) {
            this.picked = true
        }

        if (this.picked) {
            this.expirationTimer -= deltaTime
            this.animSpeed = max(0, this.fastestAnimSpeed - (this.fastestAnimSpeed / this.flashStartTime * this.expirationTimer))
            this.dead = this.expirationTimer <= 0
        }

        if (this.dead) {
            this.plant.fruits.splice(this.index, 1)
        }

        this.draggingLastFrame = this.isDragging
        return !this.dead
    }
}

class Berry extends Fruit {
    constructor(x, y, plant) {
        super(x, y, [loadImage("imgs/berry1.png"), loadImage("imgs/berry2.png")], plant)
        this.name = "Berry"

        this.expirationTimer = 5 * ms
    }

    update() {
        super.update()
        return !this.dead
    }
}

class Bush extends Plant {
    constructor(x, y) {
        super(x, y, [loadImage("imgs/bush1.png"), loadImage("imgs/bush2.png")])
        this.animSpeed = 0
        this.name = "Bush"
        this.draggable = false

        // this.fruits.push(CreateThing(new Berry(0, 0, this)), CreateThing(new Berry(20, 20, this)))
        this.fruits.push(CreateThing(new Berry(0, 0, this, 0)))
    }

    update() {
        super.update()

        // this.animSpeed = this.isDragging ? 0.1 : 0

        return !this.dead
    }
}