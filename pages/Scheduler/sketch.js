var Scheduler = function(a)
{
    let width = 800;
    let height = 600;

    let DaysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let week;

    let weekX = 10;
    let weekY = 100;
    let weekW = 700;
    let weekH = 400;

    var startHour = 10;
    var endHour = 22;
    var dayLength = endHour - startHour;

    var selectionHandler;

    let fontMedium, fontBold, fontExtraBold;
    a.preload = function()
    {
        fontMedium = a.loadFont('../../fonts/OpenSans-Medium.ttf');
        fontBold = a.loadFont('../../fonts/OpenSans-Bold.ttf');
        fontExtraBold = a.loadFont('../../fonts/OpenSans-ExtraBold.ttf');
    }

    a.setup = function()
    {
        a.pixelDensity(1);
        var canvas = a.createCanvas(width, height);
        canvas.parent("sketch");
        a.frameRate(30);
        a.textFont(fontMedium);

        var DateNow = new Date('October 30, 2022 00:00:00 GMT-07:00');

        weekX = width/2 - weekW/2;
        week = new Week(weekX, weekY, weekW, weekH, DateNow)

        selectionHandler = new SelectionHandler();
    }

    a.draw = function()
    {
        a.background(190, 170, 230);
        week.drawWeek();
        selectionHandler.update();
    }

    a.mouseClicked = function()
    {
        if (a.keyIsDown(a.SHIFT))
        {
            selectionHandler.handleShiftClick(a.mouseX, a.mouseY);
        }
        else
        {
            selectionHandler.handleClick(a.mouseX, a.mouseY);
        }
    }

    class SelectionHandler
    {
        constructor()
        {
            this.lastClick = false;
            this.lastDayClick;
            this.lastHourClick;
            this.lastHalfClick;
        }

        update()
        {

        }

        handleClick(mouseX, mouseY)
        {
            var halfClicked = this.mouseToHalfClicked(mouseY);
            this.lastClick = week.days[this.mouseToDayIndex(mouseX)].hours[this.mouseToHourIndex(mouseY)].hourClicked(halfClicked);
            this.lastDayClick = this.mouseToDayIndex(mouseX);
            this.lastHourClick = this.mouseToHourIndex(mouseY);
            this.lastHalfClick = halfClicked;
        }

        handleShiftClick(mouseX, mouseY)
        {
            if (this.lastClick)
            {
                if (this.mouseToDayIndex(mouseX) == this.lastDayClick)
                {
                    var halfClicked = this.mouseToHalfClicked(mouseY);
                    var select;
                    if (this.mouseToHourIndex(mouseY) >= this.lastHourClick)
                    {
                        select = true;
                    }
                    else
                    {
                        select = false
                    }
                    if (this.lastHalfClick == 0)
                    {
                        week.days[this.mouseToDayIndex(mouseX)].hours[this.lastHourClick].setSelected(1, select);
                    }
                    if (select)
                    {
                        for (var i = this.lastHourClick; i < this.mouseToHourIndex(mouseY) + 1; i++)
                        {
                            if (i > this.lastHourClick)
                            {
                                if (halfClicked == 0 && i == this.mouseToHourIndex(mouseY))
                                {
                                    week.days[this.mouseToDayIndex(mouseX)].hours[i].setSelected(0, select);
                                }
                                else
                                {
                                    week.days[this.mouseToDayIndex(mouseX)].hours[i].setSelected(0, select);
                                    week.days[this.mouseToDayIndex(mouseX)].hours[i].setSelected(1, select);
                                }
                            }
                        }
                    }
                }
            }
        }

        mouseToDayIndex(mouseX)
        {
            return a.floor((mouseX - week.x)/week.dayW);
        }

        mouseToHourIndex(mouseY)
        {
            return a.floor((mouseY - week.y)/(week.h/dayLength));
        }

        mouseToHalfClicked(mouseY)
        {
            return a.floor((mouseY - week.y)/(week.h/dayLength)*2)/2 - this.mouseToHourIndex(mouseY);
        }
    }

    class Week
    {
        constructor(x, y, w, h, FirstDate)
        {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.dayW = this.w/7;
            this.FirstDate = FirstDate;
            this.days = []
            for (var i = 0; i < 7; i++)
            {
                var date = new Date(this.FirstDate);
                date.setDate(this.FirstDate.getDate() + i);
                var day = new Day(
                    DaysOfWeek[i], 
                    date, 
                    this.x + i*this.dayW, 
                    this.y, 
                    this.dayW, 
                    this.h
                );
                this.days.push(day);
            }
        }

        drawWeek()
        {
            a.push()
            a.strokeWeight(4);
            a.stroke(117, 91, 168);
            a.fill(190, 170, 230);
            for (var i = 0; i < 7; i++)
            {
                this.days[i].drawDay();
            }
            a.pop()
        }
    }

    class Day
    {
        constructor(day, date, x, y, w, h)
        {
            this.day = day;
            this.date = date;
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;

            this.hours = []

            for (var i = 0; i < dayLength; i++)
            {
                var hour = new Hour(
                    startHour + i,
                    this.x,
                    this.y + i*this.h/dayLength,
                    this.w,
                    this.h/dayLength
                );
                this.hours.push(hour);
            }
        }
        
        drawDay()
        {
            a.rect(
                this.x,
                this.y,
                this.w,
                this.h,
                5
            );

            a.push()
            a.strokeWeight(2);
            a.stroke(117, 91, 168);
            a.fill(27, 91, 209, 100);
            for (var i = 0; i < dayLength; i++)
            {
                this.hours[i].drawHour();
                if (this.day == "Sunday")
                {
                    this.hours[i].drawHourLabel();
                }
            }
            a.pop()

            a.push()
            a.noStroke();
            a.fill(117, 91, 168)
            a.textSize(16)
            a.textAlign(a.CENTER)
            a.textFont(fontBold);
            a.text(this.day, this.x + this.w/2, this.y - 10);
            a.pop()
        }
    }

    class Hour
    {
        constructor(hour, x, y, w, h)
        {
            this.hour = hour;
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.selected = [false, false];
        }

        drawHour()
        {
            a.push()
            a.noStroke();
            if (this.selected[0])
            {
                a.rect(this.x, this.y, this.w, this.h/2);
            }
            if (this.selected[1])
            {
                a.rect(this.x, this.y + this.h/2, this.w, this.h/2);
            }
            a.pop()
            if (this.hour != 0)
            {
                if (this.hour%2 == 0)
                {
                    a.stroke(117, 91, 168);
                }
                else
                {
                    a.stroke(117, 91, 168, 100);
                }
                a.line(this.x, this.y, this.x+this.w, this.y);
            }
        }

        drawHourLabel()
        {
            a.push();
            a.noStroke();
            a.fill(117, 91, 168);
            a.textSize(12);
            a.textAlign(a.RIGHT, a.CENTER);
            a.text(this.hour, this.x - 10, this.y);
            a.pop();
        }

        hourClicked(halfClicked)
        {
            if (halfClicked == 0)
            {
                this.selected[0] = !this.selected[0];
                return this.selected[0];
            }
            else
            {
                this.selected[1] = !this.selected[1];
                return this.selected[1];
            }
        }

        setSelected(halfClicked, bool)
        {
            if (halfClicked == 0)
            {
                this.selected[0] = bool;
            }
            else
            {
                this.selected[1] = bool;
            }
        }
    }

    HoursToMilliseconds = function(hours)
    {
        return hours * 60 * 60 * 1000;
    }
}

var SchedulerP5 = new p5(Scheduler, "sketch");