
var TikTokData = function(a)
{
    let data = {}
    let VideoList = {}

    var VideoListDict = {}
    var VideoListLargestFreq = 0

    var Days = ["S", "M", "T", "W", "Th", "F", "S"]
    var VideoListDayFreq = [0, 0, 0, 0, 0, 0, 0]
    var VideoListDayLargestFreq = 0

    var TimesOnline = []
    var TimesOnlineDict = {}
    var TimesOnlineCount = 0

    a.preload = function()
    {
        data = a.loadJSON("data/andrea_user_data.json")
        console.log("json loaded")
    }

    a.setup = function()
    {
        var canvas = a.createCanvas(1000, 600)
        canvas.parent("sketch")
        a.frameRate(30)
        a.noLoop()
        a.textFont('Courier New')
        
        VideoList = data["Activity"]["Video Browsing History"]["VideoList"]
        
        var date
        var dateSplit = a.split(a.split(VideoList[0]["Date"], " ")[0], "-")
        var timeSplit = a.split(a.split(VideoList[0]["Date"], " ")[1], ":")
        var lastTime = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], timeSplit[0], timeSplit[1], timeSplit[2])
        var currTime
        var BREAK_INTERVAL = 600000
        
        var sessionStart = lastTime
        var sessionEnd = lastTime

        for (var i = 0; i < VideoList.length; i++)
        // for (var i = 0; i < 2000; i++)
        {
            date = a.split(VideoList[i]["Date"], " ")[0]
            dateSplit = a.split(date, "-")
            var dateFormatted = new Date(dateSplit[0], dateSplit[1]-1, dateSplit[2])
            var time = a.split(VideoList[i]["Date"], " ")[1]
            if (date in VideoListDict)
            {
                VideoListDict[date].addPair(time, VideoList[i]["VideoLink"])
            }
            else
            {
                VideoListDict[date] = new VideoListData(dateFormatted)
                VideoListDict[date].addPair(time, VideoList[i]["VideoLink"])
            }

            var dayOfWeek = dateFormatted.getDay()
            VideoListDayFreq[dayOfWeek] += 1

            // calculate times spent watching
            timeSplit = a.split(time, ":")
            currTime = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], timeSplit[0], timeSplit[1], timeSplit[2])

            if (Math.abs(currTime - lastTime) > BREAK_INTERVAL)
            {
                TimesOnlineCount++
                sessionStart = lastTime
                TimesOnline.push([sessionStart, sessionEnd])
                // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                // console.log("sessionStart", sessionStart)
                // console.log("sessionEnd", sessionEnd)
                // console.log("TimesOnline", TimesOnline)

                // console.log("date", date)
                // console.log("datetime", VideoList[i]["Date"])
                // console.log("timeSplit", timeSplit)
                // console.log("currTime", currTime)
                // console.log("lastTime", lastTime)

                var lastDate = a.split(VideoList[i-1]["Date"], " ")[0]

                if (lastDate in TimesOnlineDict)
                {
                    TimesOnlineDict[lastDate].push([sessionStart, sessionEnd])
                }
                else
                {
                    TimesOnlineDict[lastDate] = [[sessionStart, sessionEnd]]
                }

                sessionEnd = currTime
            }

            lastTime = currTime
        }

        for (var i = 0; i < Object.keys(VideoListDict).length; i++)
        {
            if (Object.values(VideoListDict)[i].frequency > VideoListLargestFreq)
            {
                VideoListLargestFreq = Object.values(VideoListDict)[i].frequency;
            }
        }

        for (var i = 0; i < VideoListDayFreq.length; i++)
        {
            if (VideoListDayFreq[i] > VideoListDayLargestFreq)
            {
                VideoListDayLargestFreq = VideoListDayFreq[i];
            }
        }

        console.log("VideoListDict", VideoListDict)
        console.log("VideoListDayFreq", VideoListDayFreq)
        console.log("TimesOnlineCount", TimesOnlineCount)
        console.log("TimesOnline", TimesOnline)
        console.log("TimesOnlineDict", TimesOnlineDict)
        console.log("VideoListLargestFreq", VideoListLargestFreq)
        console.log("VideoListDayLargestFreq", VideoListDayLargestFreq)
    }

    a.draw = function()
    {
        a.background(0, 0, 0)

        VideosPerDayOfWeek()
        CalculateVideoWatchFreq()
        
        a.push()
        a.textAlign(a.CENTER, a.TOP)
        a.fill(255)
        a.text("when i'm online", (SessionTimesDesc.lineEndX - SessionTimesDesc.lineStartX) / 2 + SessionTimesDesc.lineStartX, SessionTimesDesc.margin - SessionTimesDesc.spacing)
        a.pop()
        DrawSessionTimesPeripherals()
        for (var i = 0; i < 7; i++)
        {
            CalculateSessionTimes(i, SessionTimesDesc.margin + SessionTimesDesc.spacing*i)
        }
    }
    
    var SessionTimesDesc =
    {
        lineStartX : 275,
        lineEndX : 960,
        margin : 80,
        spacing : 40
    }

    DrawSessionTimesPeripherals = function()
    {
        a.push()
        a.stroke(255, 255, 255, 50)
        a.strokeWeight(2)
        a.textAlign(a.CENTER, a.TOP)
        a.fill(255)
        var x
        for (var t = 0; t < 25; t += 2)
        {
            x = a.map(t, 0, 24, SessionTimesDesc.lineStartX, SessionTimesDesc.lineEndX)
            a.text(t, x, SessionTimesDesc.margin + SessionTimesDesc.spacing * 6.5)
        }
        a.pop()
    }

    CalculateSessionTimes = function(inDay, lineY)
    {
        // drawing y axis
        a.push()
        a.stroke(252, 186, 3)
        a.strokeWeight(2)
        let lineStart = a.createVector(SessionTimesDesc.lineStartX, lineY)
        let lineEnd = a.createVector(SessionTimesDesc.lineEndX, lineY)
        // a.line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y)
        a.pop()

        // drawing the labels
        a.push()
        a.textAlign(a.CENTER, a.CENTER)
        a.fill(255)
        a.text(Days[inDay], lineStart.x - 15, lineY)
        a.pop()

        var TimesOnlineDictLength = Object.keys(TimesOnlineDict).length

        a.push()
        var transparency = 0.05
        a.stroke(188, 145, 255, 255*transparency)
        a.strokeWeight(10)
        a.strokeCap(a.SQUARE)
        var date
        var day
        var timesOnlineDay
        for (var i = 0; i < TimesOnlineDictLength; i++)
        {
            date = a.split(Object.keys(TimesOnlineDict)[i], "-")
            day = new Date(date[0], date[1] - 1, date[2]).getDay()
            if (day == inDay)
            {
                timesOnlineDay = Object.values(TimesOnlineDict)[i]

                var session
                var start, end
                for (var t = 0; t < timesOnlineDay.length; t++)
                {
                    session = timesOnlineDay[t]
                    start = a.map(session[0].getHours(), 0, 23, lineStart.x, lineEnd.x)
                    end = a.map(session[1].getHours(), 0, 23, lineStart.x, lineEnd.x)
                    a.line(start, lineY, end, lineY)
                }
            }
        }
        a.pop()
    }

    CalculateVideoWatchFreq = function()
    {
        //--- VIDEOS WATCHED OVER TIME
        // drawing y axis
        a.push()
        a.stroke(252, 186, 3)
        a.strokeWeight(2)
        let lineY = 500
        let lineStart = a.createVector(20, lineY)
        let lineEnd = a.createVector(960, lineY)
        a.line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y)
        a.pop()

        // draw the bars
        var VideoListDictLength = Object.keys(VideoListDict).length
        var firstTime = Object.values(VideoListDict)[VideoListDictLength - 1].date.getTime()
        var lastTime = Object.values(VideoListDict)[0].date.getTime()
        var numOfDays = (lastTime - firstTime) / (1000 * 3600 * 24)
        var maxHeight = 200
        var width = (lineEnd.x - lineStart.x)/numOfDays

        for (var i = 0; i < VideoListDictLength; i++)
        {
            a.push()
            a.noStroke()
            a.fill(50, 168, 82)
            var xValue = a.map(Object.values(VideoListDict)[i].date.getTime(), firstTime, lastTime, lineStart.x + width/2, lineEnd.x - width/2)
            var height = Object.values(VideoListDict)[i].frequency*(maxHeight/VideoListLargestFreq)
            a.rect(xValue - width/2, lineY - height, width, height)
            a.pop()
        }
    }

    VideosPerDayOfWeek = function()
    {
        //--- VIDEOS PER DAY OF WEEK
        // drawing y axis
        a.push()
        a.stroke(252, 186, 3)
        a.strokeWeight(2)
        let lineY = 200
        let lineStart = a.createVector(20, lineY)
        let lineEnd = a.createVector(200, lineY)
        a.line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y)
        a.pop()

        // draw the bars
        var maxHeight = 100

        for (var i = 0; i < VideoListDayFreq.length; i++)
        {
            a.push()
            a.noStroke()
            a.fill(50, 168, 82)
            var width = (lineEnd.x - lineStart.x)/(VideoListDayFreq.length)
            var xValue = a.map(i, 0, 6, lineStart.x + width/2, lineEnd.x - width/2)
            var height = VideoListDayFreq[i]*(maxHeight/VideoListDayLargestFreq)
            a.rect(xValue - width/2, lineY - height, width, height)
            a.pop()

            // Draw labels
            a.push()
            a.textAlign(a.CENTER, a.TOP)
            a.fill(255)
            a.text(Days[i], xValue, lineY + 5)
            a.pop()
        }
    }

    class VideoListData
    {
        constructor(date)
        {
            this.date = date
            this.frequency = 0
            this.timeLinkDict = {}
        }

        addPair = function(time, link)
        {
            if (time in this.timeLinkDict)
            {
                this.timeLinkDict[time].push(link)
            }
            else
            {
                this.timeLinkDict[time] = [link]
            }

            this.frequency += 1
        }
    }
}

var TikTokDataP5 = new p5(TikTokData, "sketch")

