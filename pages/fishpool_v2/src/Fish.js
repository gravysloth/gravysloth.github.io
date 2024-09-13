//
//
// Parent class for fish types
//
//

class Fish extends Flocking {
    constructor(pos, vel, size) {
        super(pos, vel, 0.99)
        this.size = size
    }

    draw() {}
}