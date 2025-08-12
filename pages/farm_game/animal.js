class Animal extends Thing {
    constructor(x, y, imageArray, foodType) {
        super(x, y, imageArray)

        this.xTarget = x
        this.yTarget = y
        this.animSpeed = 2
        this.name = "animal"
        this.foodType = foodType
        this.waitTimer = random(1 * secondsToMs, 5 * secondsToMs)
        this.walkTimer = 0
        this.foodTimer = 0
        this.poopDelay = 3 * secondsToMs
        this.poopTimer = 0
        this.isCreatingPoop = false
        this.walkSpeed = 36
        this.eatSpeed = 10
        this.waiting = false

        if (random(0, 1) < 0.5) {
            this.xDir = -1
        }
    }

    update() {
        super.update()

        if (this.animIndex > this.anim.length) {
            this.animIndex = 0
            this.image = this.anim[this.animIndex]
        }

        // change to idle first frame if waiting
        this.waiting = dist(this.x, this.y, this.xTarget, this.yTarget) <= 4
        if (this.waiting || this.isDragging) {
            this.image = this.anim[0]
        }

        if (this.isCreatingPoop) {
            this.poopTimer += deltaTime
        }
        if (this.poopTimer >= this.poopDelay) {
            this.poopTimer = 0
            this.isCreatingPoop = false
            this.poop()
        }

        // randomly walk around if not picked up
        if (!this.isDragging && this.foodTimer <= 0) {
            if (this.waitTimer <= 0) {
                this.newWalk()
            }

            if (this.waiting) {
                this.waitTimer = max(this.waitTimer - deltaTime, 0)
            }
            else {
                let angle = GetAngle(this.x, this.y, this.xTarget, this.yTarget)
                let dx = cos(angle) * this.walkSpeed * deltaTime / secondsToMs
                if (dx < 0) {
                    this.xDir = -1
                }
                if (dx > 0) {
                    this.xDir = 1
                }
                this.x += dx
                this.y += sin(angle) * this.walkSpeed * deltaTime / secondsToMs
                this.walkTimer++

                if (this.walkTimer > 60 * 10) {
                    this.newWalk()
                }
            }
        }
        else {
            this.newWalk()
            this.xTarget = this.x
            this.yTarget = this.y
        }

        if (!this.isDraggingLastFrame && this.isDragging) {
            pickupSound()
        } else if (this.isDraggingLastFrame && !this.isDragging) {
            putdownSound()
        }

        return !this.dead
    }

    newWalk() {
        this.waitTimer = random(1 * secondsToMs, 5 * secondsToMs)
        this.walkTimer = 0
        this.xTarget = random(this.radius, GameWidth - this.radius)
        this.yTarget = random(this.radius, GameHeight - this.radius)
    }

    canFeed() {
        return !this.isCreatingPoop
    }
    feed() {
        // this.foodTimer = 60 * this.eatSpeed
        this.isCreatingPoop = true
    }
    poop() {
        CreateThing(new Poop(this.x - this.image.width / 2 * this.xDir, this.y + this.image.height / 2 - 32, [loadImage('imgs/poop1.png'), loadImage('imgs/poop2.png')]))
        console.log("pooped!")
    }
}

class Jojo extends Animal {
    constructor(x, y) {
        super(x, y, [loadImage('imgs/jojo1.png'), loadImage('imgs/jojo2.png')], Berry)
        this.name = "jojo"
    }

    update() {
        super.update()

        return !this.dead
    }

    feed() {
        super.feed()
        eatSound(this.name)
    }
}