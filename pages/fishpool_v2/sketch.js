//
//
//
//
//

let tetras = []

function preload() {
}

function setup() {
    var canvas = createCanvas(600, 600)
    canvas.parent("sketch")
    frameRate(30)
    noStroke()

    for (let t = 0; t < 5; t++) {
        let tetra = new Tetra(createVector(50 + 10*t, 70 + 20*t), 10)
        tetras.push(tetra)
    }
}

function draw() {
    background(75, 101, 153)

    for (let tetra of tetras) {
        tetra.evalInteractions(tetras, true, false, true, false, false)
        tetra.update()
        tetra.keepClose()
        tetra.draw()
    }
}
