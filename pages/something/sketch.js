//
//
//
//
//

let pixels = []
let gridSize = 400
let numPerSide = 50
let gridX, gridY, pixelSpacing


/**
 * Enum for color teams.
* @readonly
* @enum {{name: string, hex: string}}
*/
const Colors = Object.freeze({
    RED:   { name: "red", hex: "#f54242" },
    BLUE:  { name: "blue", hex: "#4287f5" },
    GREEN: { name: "green", hex: "#0f0" }
});

function preload() {
}

function setup() {
    var canvas = createCanvas(600, 600)
    canvas.parent("sketch")
    frameRate(5)
    noStroke()
    ellipseMode(CENTER)

    gridX = width/2 - gridSize/2
    gridY = height/2 - gridSize/2
    let pixelSize = gridSize / numPerSide
    pixelSpacing = gridSize/(numPerSide-1)
    for (let row = 0; row < numPerSide; row++) {
        let pixelRow = []
        for (let col = 0; col < numPerSide; col++) {
            pixelRow.push(
                new Pixel(
                    gridX + col*pixelSpacing,
                    gridY + row*pixelSpacing,
                    pixelSize,
                    row, col))
        }
        pixels.push(pixelRow)
    }
    console.log(pixels)
}

function draw() {
    //   background(24, 24, 26)
    background(10, 10, 10)

    for (let row = 0; row < numPerSide; row++) {
        for (let col = 0; col < numPerSide; col++) {
            pixels[row][col].draw()
            pixels[row][col].calculate()
        }
    }
}

function keyPressed() {
    if (key == " ") {
        for (let row = 0; row < numPerSide; row++) {
            for (let col = 0; col < numPerSide; col++) {
                pixels[row][col].calculate()
            }
        }
        console.log(pixels)
    }
}

function mouseClicked() {
    let row = round((mouseY - gridY) / pixelSpacing)
    let col = round((mouseX - gridX) / pixelSpacing)
    if (!(row <= 0 || row >= numPerSide-1 || col <= 0 || col >= numPerSide-1)) {
        let color = pixels[row][col].color
        let newColor = color == Colors.RED ? Colors.BLUE : Colors.RED
        for (let r = row - 1; r < row + 2; r++) {
            pixels[r][col].color = newColor
        }
        for (let c = col - 1; c < col + 2; c++) {
            pixels[row][c].color = newColor
        }
    }
}

class Pixel {
    constructor(x, y, size, row, col) {
        this.x = x
        this.y = y
        this.size = size
        this.row = row
        this.col = col
        this.state = 0
        this.color = Colors.RED
    }

    draw() {
        push()
        translate(this.x, this.y)
        fill(this.color.hex)
        // ellipse(0, 0, this.size)
        rectMode(CENTER)
        square(0, 0, this.size+1)
        pop()
    }

    calculate() {
        let blueChance = 0
        let redChance = 0
        let rMin = this.row == 0 ? 0 : this.row - 1
        let rMax = this.row == numPerSide - 1 ? numPerSide - 1 : this.row + 1
        let cMin = this.col == 0 ? 0 : this.col - 1
        let cMax = this.col == numPerSide - 1 ? numPerSide - 1 : this.col + 1

        for (let r = rMin; r <= rMax; r++) {
            for (let c = cMin; c <= cMax; c++) {
                let color = pixels[r][c].color
                if (color == Colors.RED) {
                    redChance += 1
                } else if (color == Colors.BLUE) {
                    blueChance += 1
                }
            }
        }

        let rand = random(blueChance+redChance)
        if (rand < blueChance) {
            this.color = Colors.BLUE
        } else {
            this.color = Colors.RED
        }
    }
}