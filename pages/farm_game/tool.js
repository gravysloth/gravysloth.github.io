class Menu {
    constructor() {
        this.x = 0
        this.y = GameHeight
        this.width = GameWidth
        this.height = height - GameHeight

        this.scooper = new Scooper(this.x + 50, this.y + 50)
    }

    draw() {
        push()
        noStroke()
        fill(255, 200, 200)
        rect(this.x, this.y, this.width, this.height)
        pop()

        this.scooper.draw()
    }
}

class Tool extends Thing {
    constructor(x, y, imageArray) {
        super(x, y, imageArray)
    }
}

class Scooper extends Tool {
    constructor(x, y, imageArray) {
        super(x, y, [loadImage('imgs/scooper1.png')])
    }
}