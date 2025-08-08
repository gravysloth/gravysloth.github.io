var capture;
var filterSize;
var filters;
var stepDividerX = 50;

function setup() {
    var canvas = createCanvas(800, 600);
    canvas.parent("sketch")
    filterSize = createVector(400, 300);
    capture = createCapture(VIDEO);
    capture.size(filterSize.x, filterSize.y);

    filters = [new Squares(0, 0), new Circles(400, 0)];
}

function draw() {
    background(220, 220, 220, 255);
    capture.loadPixels();

    for (var f = 0; f < filters.length; f++) {
        filters[f].drawFilter();
    }
}

function mouseWheel(event) {
    console.log("ah");
    if (event.delta > 0 && stepDividerX > 1) {
        stepDividerX -= 1;
    } else {
        stepDividerX += 1;
    }
}

class Filter {
    constructor(x, y) {
        this.pos = createVector(x, y);
    }

    drawFilter() {
        push();
        this.filter();
        pop();
    }

    filter() {
        fill(random(0, 255), random(0, 255), random(0, 255));
        rect(this.pos.x, this.pos.y, filterSize.x, filterSize.y);
    }
}

class Squares extends Filter {
    constructor(x, y) {
        super(x, y);
    }

    filter() {
        var rectSizeX = filterSize.x / stepDividerX;
        var stepSize = floor(rectSizeX);
        var stepDividerY = filterSize.y / rectSizeX;
        var rectSizeY = filterSize.y / stepDividerY;
        console.log(rectSizeX, rectSizeY);
        for (var x = 0; x < stepDividerX; x += 1) {
            for (var y = 0; y < stepDividerY; y += 1) {
                var index = (y * stepSize * capture.width + x * stepSize) * 4;
                var redVal = capture.pixels[index];
                var greenVal = capture.pixels[index + 1];
                var blueVal = capture.pixels[index + 2];
                noStroke();
                fill(redVal, greenVal, blueVal);
                rectMode(CORNER);
                rect(x * rectSizeX + this.pos.x, y * rectSizeY + this.pos.y, rectSizeX + 1, rectSizeY + 1);
            }
        }
    }
}

class Circles extends Filter {
    constructor(x, y) {
        super(x, y);
    }

    filter() {
        var rectSizeX = filterSize.x / stepDividerX;
        var stepSize = floor(rectSizeX);
        var stepDividerY = filterSize.y / stepSize;
        var rectSizeY = filterSize.y / stepDividerY;
        for (var x = 0; x < stepDividerX; x += 1) {
            for (var y = 0; y < stepDividerY; y += 1) {
                var index = (y * stepSize * capture.width + x * stepSize) * 4;
                var redVal = capture.pixels[index];
                var greenVal = capture.pixels[index + 1];
                var blueVal = capture.pixels[index + 2];
                var brightness = 1 - (redVal + greenVal + blueVal) / (255 * 3);
                fill(0, 0, 0);
                ellipseMode(CENTER);
                ellipse(x * rectSizeX + this.pos.x + rectSizeX / 2, y * rectSizeY + this.pos.y + rectSizeX / 2, rectSizeX * brightness);
            }
        }
    }
}