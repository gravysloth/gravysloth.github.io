class Plant extends Thing {
    constructor(x, y, imageArray, FruitClass, fruitAreaRadius) {
        super(x, y, imageArray)
        this.fruits = []
        this.maxFruit = 3
        this.FruitClass = FruitClass
        this.fruitAreaRadius = fruitAreaRadius

        this.newFruitTimer = random(0 * secondsToMs, 3 * secondsToMs)
        this.isGrowingNewFruit = false
    }

    update() {
        super.update()

        if (this.fruits.length < this.maxFruit && !this.isGrowingNewFruit) {
            this.isGrowingNewFruit = true
        }

        if (this.isGrowingNewFruit) {
            this.newFruitTimer -= deltaTime
        }

        if (this.newFruitTimer <= 0 && this.isGrowingNewFruit) {
            this.isGrowingNewFruit = false
            this.newFruitTimer = random(0 * secondsToMs, 3 * secondsToMs)
            let newFruit = CreateThing(new this.FruitClass(random(-1 * this.fruitAreaRadius, this.fruitAreaRadius), random(-1 * this.fruitAreaRadius, this.fruitAreaRadius), this, this.fruits.length))
            newFruit.grown()
            this.fruits.push(newFruit)
        }

        let i = 0
        while (i < this.fruits.length) {
            if (this.fruits[i].dead || this.fruits[i].picked) {
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

class Bush extends Plant {
    constructor(x, y) {
        super(x, y, [loadImage('imgs/bush1.png'), loadImage('imgs/bush2.png')], Berry, 30)
        this.animSpeed = 0
        this.name = "Bush"
        this.draggable = false
    }

    update() {
        super.update()

        // this.animSpeed = this.isDragging ? 0.1 : 0

        return !this.dead
    }
}

class Fruit extends Thing {
    constructor(x, y, imageArray, plant, index) {
        super(plant.x + x, plant.y + y, imageArray)
        this.plant = plant
        this.index = index

        this.dX = this.x - this.plant.x
        this.dY = this.y - this.plant.y

        this.expirable = true
        this.expirationTimer = 20 * secondsToMs
        this.fastestAnimSpeed = 10
        this.flashStartTime = 5 * secondsToMs
        this.expiring = false

        this.mainDraw = false
        this.picked = false
    }

    update() {
        super.update()

        if (this.isDragging && !this.isDraggingLastFrame && !this.picked) {
            fruitPickedSound()
        }

        if (this.isDragging) {
            this.picked = true
            this.mainDraw = true
            this.dX = this.x - this.plant.x
            this.dY = this.y - this.plant.y
        } else {
            this.x = this.plant.x + this.dX
            this.y = this.plant.y + this.dY
        }

        if (!this.isDragging && this.isDraggingLastFrame && this.picked) {
            this.expiring = true
        }

        if (this.picked && !this.isDragging) {
            let coll = this.collisionObject("jojo")
            if (coll !== null) {
                if (coll.canFeed()) {
                    coll.feed()
                    this.eaten()
                    this.dead = true
                }
            }
        }

        return !this.dead
    }

    grown() {
        fruitGrownSound()
    }
    eaten() { }
}

class Berry extends Fruit {
    constructor(x, y, plant) {
        super(x, y, [loadImage('imgs/berry1.png'), loadImage('imgs/berry2.png')], plant)
        this.name = "Berry"

        this.expirationTimer = 10 * secondsToMs
    }

    update() {
        super.update()


        return !this.dead
    }

    grown() {
        super.grown()
        newAnimation("berryGrown", this.x, this.y)
    }

    eaten() {
        super.eaten()
        newAnimation("berryEaten", this.x, this.y)
    }
}