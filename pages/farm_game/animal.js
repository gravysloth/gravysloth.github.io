class Animal extends Thing {
    constructor(x, y, imageArray) {
        super(x, y, imageArray)

        this.xTarget = x
        this.yTarget = y
        this.animSpeed = 2
        this.name = "animal"
        this.waitTimer = random(1 * ms, 5 * ms)
        this.walkTimer = 0
        this.foodTimer = 0
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
        if (this.waiting || this.pickup) {
            this.image = this.anim[0]
        }

        if (this.foodTimer > 0) {
            this.foodTimer--
            if (this.foodTimer <= 0) {
                this.poop()
            }

            if (this.foodTimer % 16 < 8) {
                this.image = this.anim[2]
            }
            else {
                this.image = this.anim[0]
            }
        }

        // randomly walk around if not picked up
        if (!this.pickup && this.foodTimer <= 0) {
            if (this.waitTimer <= 0) {
                this.newWalk()
            }

            if (this.waiting) {
                this.waitTimer = max(this.waitTimer - deltaTime, 0)
            }
            else {
                let angle = GetAngle(this.x, this.y, this.xTarget, this.yTarget)
                let dx = cos(angle) * this.walkSpeed * deltaTime / ms
                if (dx < 0) {
                    this.xDir = -1
                }
                if (dx > 0) {
                    this.xDir = 1
                }
                this.x += dx
                this.y += sin(angle) * this.walkSpeed * deltaTime / ms
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

        if (!this.draggingLastFrame && this.isDragging) {
            wah1.play()
        } else if (this.draggingLastFrame && !this.isDragging) {
            wah2.play()
        }

        return !this.dead
    }

    newWalk() {
        this.waitTimer = random(1 * ms, 5 * ms)
        this.walkTimer = 0
        this.xTarget = random(this.radius, GameWidth - this.radius)
        this.yTarget = random(this.radius, GameHeight - this.radius)
    }

    canFeed() {
        return this.foodTimer <= 0
    }
    feed() {
        // this.foodTimer = 60 * this.eatSpeed
    }
    poop() {
        // CreateThing(new Poop(this.x,this.y))
    }
}

class Jojo extends Animal {
    constructor(x, y) {
        super(x, y, [loadImage("imgs/jojo1.png"), loadImage("imgs/jojo2.png")])
        this.name = "jojo"
    }

    update() {
        super.update()

        return !this.dead
    }
}