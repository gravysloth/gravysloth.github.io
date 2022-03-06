var voronoi = function(a)
{
    var DrawObjects = []

    var CircleCells = []

    var radius = 60

    a.preload = function()
    {
        
    }

    a.setup = function()
    {
        var canvas = a.createCanvas(600, 600);
        canvas.parent("sketch");
        a.frameRate(30);
    }

    a.draw = function()
    {
        a.background(77, 77, 77);

        for (var i = 0; i < DrawObjects.length; i++)
        {
            DrawObjects[i].Draw();
        }
    }

    a.mouseClicked = function()
    {
        var ptCircle = new CircleCell(a.mouseX, a.mouseY, radius);

        CheckIntersections(ptCircle);
    }

    CheckIntersections = function(newPtCircle)
    {
        var ptCircle = newPtCircle
        for (var k = 0; k < CircleCells.length - 1; k++)
        {
            var other = CircleCells[k];
            if (ptCircle.GetPosition().dist(other.GetPosition()) < ptCircle.GetRadius() + other.GetRadius())
            {
                TwoCircleIntersection(ptCircle, other)
            }
        }
    }

    TwoCircleIntersection = function (c1, c2)
    {
        var dx = c2.GetPosition().x - c1.GetPosition().x
        var dy = c2.GetPosition().y - c1.GetPosition().y

        var d = Math.sqrt((dy*dy) + (dx*dx))

        var a = ((c1.GetRadius() * c1.GetRadius()) - (c2.GetRadius() * c2.GetRadius()) + (d*d)) / (2 * d)

        var x2 = c1.GetPosition().x + (dx * a/d)
        var y2 = c1.GetPosition().y + (dy * a/d)

        var midPt = new Point(x2, y2)
        midPt.SetColor(181, 171, 245)

        var h = Math.sqrt((c1.GetRadius() * c1.GetRadius()) - (a * a))

        var rx = -dy * (h/d)
        var ry = dx * (h/d)

        var xi = x2 + rx
        var xi_prime = x2 - rx
        var yi = y2 + ry
        var yi_prime = y2 - ry

        new LineSegment(xi, yi, xi_prime, yi_prime)
    }

    class LineSegment
    {
        constructor(x1, y1, x2, y2)
        {
            this.x1 = x1
            this.y1 = y1
            this.x2 = x2
            this.y2 = y2

            DrawObjects.push(this)
        }

        Draw()
        {
            a.push()
            {
                a.noFill()
                a.stroke(50, 168, 82)
                a.strokeWeight(2)
                a.line(this.x1, this.y1, this.x2, this.y2)
            }
            a.pop()
        }
    }

    class Point
    {
        constructor(x, y)
        {
            this.x = x;
            this.y = y;
            
            this.color = a.color(50, 168, 82)

            DrawObjects.push(this)
        }

        Draw()
        {
            a.push();
            {
                a.noFill();
                a.stroke(this.color);
                a.strokeWeight(4);
                a.point(this.x, this.y);
            }
            a.pop();
        }

        SetColor(r, g, b)
        {
            this.color = a.color(r, g, b)
        }
    }

    class Circle
    {
        constructor(x, y, r)
        {
            this.x = x;
            this.y = y;
            this.r = r;

            DrawObjects.push(this)
        }

        SetRadius(r)
        {
            this.r = r
        }

        Draw()
        {
            a.push()
            {
                a.noFill()
                a.stroke(252, 186, 3)
                a.strokeWeight(2)
                a.circle(this.x, this.y, this.r * 2)
            }
            a.pop()

        }
    }

    class CircleCell
    {
        constructor(x, y, r)
        {
            this.x = x
            this.y = y
            this.r = r
            this.point = new Point(x, y)
            this.circle = new Circle(x, y, r)

            this.lines = [];

            CircleCells.push(this)
        }

        GetPosition()
        {
            return a.createVector(this.x, this.y)
        }

        GetRadius()
        {
            return this.r;
        }

        Draw()
        {
        }
    }
}

var voronoiP5 = new p5(voronoi, "sketch")