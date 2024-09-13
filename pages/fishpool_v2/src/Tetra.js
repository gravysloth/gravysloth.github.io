//
//
//
//
//

class Tetra extends Fish {
    constructor (pos, size) {
        super(pos, createVector(1, 1), size)
    }

    setup() {
        super.setup()
        this.repulseDist = 20
        // this.alignDist = 50
        // this.attractDist = 150
        // this.huntDist = 250
        // this.limitDist = 350
        
        this.updateMovementStats()
    }

    draw() {
        super.draw()
        push()
        translate(this.pos.x, this.pos.y)
        rotate(atan2(this.vel.y, this.vel.x))
        ellipseMode(CENTER)
        fill(255, 0, 0);
        rect(0, 0, this.size, 2)
        pop()
    }

    update() {
        this.updateCoords()
        this.keepClose()
    }
}