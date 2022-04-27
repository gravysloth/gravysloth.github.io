
var TikTokData = function(a)
{
    let data = {}
    let VideoList = {}

    var VideoListDict = {}
    var Days = ["S", "M", "T", "W", "Th", "F", "S"]
    var VideoListDayFreq = [0, 0, 0, 0, 0, 0, 0]
    var VideoListLargestFreq = 0

    var TimesOnline
    var TimesOnlineDict = {}

    a.preload = function()
    {
        TimesOnline = []
        data = a.loadJSON("data/user_data.json")
        console.log("json loaded")
    }

    a.setup = function()
    {
        var canvas = a.createCanvas(1000, 600)
        canvas.parent("sketch")
        a.frameRate(30)
        a.noLoop()
        
        VideoList = data["Activity"]["Video Browsing History"]["VideoList"]
        
        var date
        var dateSplit = a.split(a.split(VideoList[0]["Date"], " ")[0], "-")
        var timeSplit = a.split(a.split(VideoList[0]["Date"], " ")[1], ":")
        var lastTime = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], timeSplit[0], timeSplit[1], timeSplit[2])
        var currTime
        var newSession = false
        var BREAK_INTERVAL = 600000
        
        var sessionStart = lastTime
        var sessionEnd = lastTime

        //for (var i = 0; i < VideoList.length; i++)
        for (var i = 0; i < 1000; i++)
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
                newSession = true
                sessionStart = lastTime
                TimesOnline.push([sessionStart, sessionEnd])
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                console.log("sessionStart", sessionStart)
                console.log("sessionEnd", sessionEnd)
                console.log("TimesOnline", TimesOnline)

                console.log("date", date)
                console.log("datetime", VideoList[i]["Date"])
                console.log("timeSplit", timeSplit)
                console.log("currTime", currTime)
                console.log("lastTime", lastTime)

                if (date in TimesOnlineDict)
                {
                    TimesOnlineDict[date].push([sessionStart, sessionEnd])
                }
                else
                {
                    TimesOnlineDict[date] = [[sessionStart, sessionEnd]]
                }

                sessionEnd = currTime
            }
            else
            {
                newSession = false
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

        console.log("VideoListDict", VideoListDict)
        console.log("VideoListDayFreq", VideoListDayFreq)
        console.log("TimesOnline", TimesOnline)
        console.log("TimesOnlineDict", TimesOnlineDict)

        a.textFont('Courier New')
    }

    a.draw = function()
    {
        a.background(0, 0, 0)

        VideosPerDayOfWeek()
        CalculateVideoWatchFreq()
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
        let lineEnd = a.createVector(980, lineY)
        a.line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y)
        a.pop()

        // draw the bars
        var VideoListDictLength = Object.keys(VideoListDict).length
        var firstTime = Object.values(VideoListDict)[VideoListDictLength - 1].date.getTime()
        var lastTime = Object.values(VideoListDict)[0].date.getTime()
        var maxHeight = 200

        for (var i = 0; i < VideoListDictLength; i++)
        {
            a.push()
            a.noStroke()
            a.fill(50, 168, 82)
            var width = (lineEnd.x - lineStart.x)/VideoListDictLength
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
        var largestFreq = 21335
        var maxHeight = 100

        for (var i = 0; i < VideoListDayFreq.length; i++)
        {
            a.push()
            a.noStroke()
            a.fill(50, 168, 82)
            var width = (lineEnd.x - lineStart.x)/(VideoListDayFreq.length)
            var xValue = a.map(i, 0, 6, lineStart.x + width/2, lineEnd.x - width/2)
            var height = VideoListDayFreq[i]*(maxHeight/largestFreq)
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

