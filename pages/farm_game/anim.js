let anims = []

function updateAnims() {
    let i = 0
    while (i < anims.length) {
        if (anims[i].update() && !anims[i].dead) {
            i++
        } else {
            anims.splice(i, 1)
        }
    }
}

function drawAnims() {
    for (let i = 0; i < anims.length; i++) {
        anims[i].draw()
    }
}

function newAnimation(name, x, y) {
    let newAnim
    switch (name) {
        case "berryEaten":
            newAnim = new Anim(x, y, [loadImage('imgs/berryEat1.png'), loadImage('imgs/berryEat2.png'), loadImage('imgs/berryEat3.png'), loadImage('imgs/berryEat4.png')])
            anims.push(newAnim)
            break
        case "berryGrown":
            newAnim = new Anim(x, y, [loadImage('imgs/berryGrown1.png'), loadImage('imgs/berryGrown2.png'), loadImage('imgs/berryGrown3.png')])
            newAnim.animSpeed = 8
            break
        default:
            console.log("ERROR: " + name + " is not recognized as an animation name.")
    }
    anims.push(newAnim)
}

class Anim extends Thing {
    constructor(x, y, imageArray) {
        super(x, y, imageArray)

        this.loop = false
        this.animSpeed = 5
    }

    update() {
        super.update()

        if (!this.loop && floor(this.animIndex) == this.anim.length - 1) {
            this.dead = true
        }

        return !this.dead
    }
}