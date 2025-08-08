class Animal extends Thing {
    constructor(x, y, imageArray) {
        super(x, y, imageArray)

        this.xTarget = x
        this.yTarget = y
        this.waitTimer = random(50, 200)
        this.animSpeed = 0.05
        this.name = "animal"
        this.walkTimer = 0
        this.foodTimer = 0
        this.eatSpeed = 10
        this.waiting = false

        if (random(0, 1) < 0.5) {
            this.xDir = -1
        }
    }

    update() {
        super.update()

        if (this.animIndex > 2) {
            this.animIndex = 0
            this.image = this.anim[this.animIndex]
        }

        // change to idle first frame if waiting
        let waiting = dist(this.x, this.y, this.xTarget, this.yTarget) <= 4
        this.waiting = waiting
        if (waiting || this.pickup) {
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

            if (waiting) {
                this.waitTimer = max(this.waitTimer - 1, 0)
            }
            else {
                let angle = GetAngle(this.x, this.y, this.xTarget, this.yTarget)
                let speed = 0.6
                let dx = cos(angle) * speed
                if (dx < 0) {
                    this.xDir = -1
                }
                if (dx > 0) {
                    this.xDir = 1
                }
                let lx = this.x
                let ly = this.y
                this.x += dx
                this.y += sin(angle) * speed
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

        return !this.dead
    }

    newWalk() {
        this.waitTimer = random(50, 200)
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
        super(x, y, [loadImage("imgs/bush1.png"), loadImage("imgs/bush2.png")])
        this.name = "jojo"
    }

    update() {
        super.update()

        return !this.dead
    }
}