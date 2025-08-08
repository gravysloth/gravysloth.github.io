class Plant extends Thing {
    constructor(x, y, imageArray) {
        super(x, y, imageArray)
        this.fruits = []
        this.maxFruit = 3
    }

    update() {
        super.update()

        let i = 0
        while (i < this.fruits.length) {
            if (this.fruits[i].dead) {
                this.fruits.splice(i, 1)
            } else {
                i++
            }
        }

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
        super(plant.x + x, plant.y + y, imageArray)
        this.plant = plant
        this.index = index

        this.dX = this.x - this.plant.x
        this.dY = this.y - this.plant.y

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
            this.dX = this.x - this.plant.x
            this.dY = this.y - this.plant.y
        } else {
            this.x = this.plant.x + this.dX
            this.y = this.plant.y + this.dY
        }

        if (!this.isDragging && this.draggingLastFrame) {
            this.picked = true
        }

        if (this.picked) {
            this.expirationTimer -= deltaTime
            this.animSpeed = max(0, this.fastestAnimSpeed - (this.fastestAnimSpeed / this.flashStartTime * this.expirationTimer))
            this.dead = this.expirationTimer <= 0
        }

        let coll = this.collisionObject("jojo")
        if (coll !== null) {
            if (coll.canFeed()) {
                coll.feed()
                this.dead = true
            }
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

        if (this.fruits.length < this.maxFruit) {
            this.fruits.push(CreateThing(new Berry(random(-30, 30), random(-30, 30), this, this.fruits.length)))
        }

        return !this.dead
    }
}