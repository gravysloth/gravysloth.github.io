
var TikTokData = function(a)
{
    let TIME_CHANGE = -7

    let data = {}
    let VideoList = {}

    var VideoListDict = {}
    var VideoListLargestFreq = 0

    var Days = ["S", "M", "T", "W", "Th", "F", "S"]
    var VideoListDayFreq = [0, 0, 0, 0, 0, 0, 0]
    var VideoListDayLargestFreq = 0

    var TimesOnlineDict = {}
    var TimesOnlineCount = 0

    var LikeList = {}
    var LikeListDict = {}

    a.preload = function()
    {
        data = a.loadJSON("data/andrea_user_data.json")
        console.log("json loaded")
    }

    a.setup = function()
    {
        var canvas = a.createCanvas(1000, 800)
        canvas.parent("sketch")
        a.frameRate(30)
        a.noLoop()
        a.textFont('Courier New')
        
        VideoListCalculations()
        
        LikeListCalculations()
    }

    VideoListCalculations = function()
    {
        VideoList = data["Activity"]["Video Browsing History"]["VideoList"]
        var dateSplit = a.split(a.split(VideoList[0]["Date"], " ")[0], "-")
        var timeSplit = a.split(a.split(VideoList[0]["Date"], " ")[1], ":")
        var trueDateTime = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], timeSplit[0], timeSplit[1], timeSplit[2])
        var dateString, lastDateString
        var timeString
        var lastTime = trueDateTime
        var BREAK_INTERVAL = 600000
        
        var sessionStart = lastTime
        var sessionEnd = lastTime

        for (var i = 0; i < VideoList.length; i++)
        {
            //-- temporary values
            dateSplit = a.split(a.split(VideoList[i]["Date"], " ")[0], "-")
            timeSplit = a.split(a.split(VideoList[i]["Date"], " ")[1], ":")
            //-- Calculate true date
            trueDateTime = new Date(
                dateSplit[0], 
                dateSplit[1] - 1, 
                dateSplit[2], 
                parseInt(timeSplit[0]) + TIME_CHANGE, 
                timeSplit[1], 
                timeSplit[2]
            )
            //-- Calculate true dateString and true dateSplit
            dateString = trueDateTime.getFullYear() + "-"
            if (trueDateTime.getMonth() + 1 < 10)
            {
                dateString += "0"
            }
            dateString += (trueDateTime.getMonth() + 1) + "-"
            if (trueDateTime.getDate() < 10)
            {
                dateString += "0"
            }
            dateString += trueDateTime.getDate()
            dateSplit = a.split(dateString, "-")

            //-- Calculate true timeString and true timeSplit
            timeString = ""
            if (trueDateTime.getHours() < 10)
            {
                timeString += "0"
            }
            timeString += trueDateTime.getHours() + ":"
            if (trueDateTime.getMinutes() < 10)
            {
                timeString += "0"
            }
            timeString += trueDateTime.getMinutes() + ":"
            if (trueDateTime.getSeconds() < 10)
            {
                timeString += "0"
            }
            timeString += trueDateTime.getSeconds()
            timeSplit = a.split(timeString, ":")
            
            var dateFormatted = new Date(dateSplit[0], dateSplit[1]-1, dateSplit[2])
            if (dateString in VideoListDict)
            {
                VideoListDict[dateString].addPair(timeString, VideoList[i]["VideoLink"])
            }
            else
            {
                VideoListDict[dateString] = new VideoListData(dateFormatted)
                VideoListDict[dateString].addPair(timeString, VideoList[i]["VideoLink"])
            }

            var dayOfWeek = dateFormatted.getDay()
            VideoListDayFreq[dayOfWeek] += 1

            //-- Calculate session times spent watching
            timeSplit = a.split(timeString, ":")

            if (Math.abs(trueDateTime - lastTime) > BREAK_INTERVAL)
            {
                TimesOnlineCount++
                sessionStart = lastTime

                if (lastDateString in TimesOnlineDict)
                {
                    TimesOnlineDict[lastDateString].push([sessionStart, sessionEnd])
                }
                else
                {
                    TimesOnlineDict[lastDateString] = [[sessionStart, sessionEnd]]
                }

                sessionEnd = trueDateTime
            }
            lastDateString = dateString
            lastTime = trueDateTime
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
        console.log("TimesOnlineDict", TimesOnlineDict)
        console.log("VideoListLargestFreq", VideoListLargestFreq)
        console.log("VideoListDayLargestFreq", VideoListDayLargestFreq)
    }

    LikeListCalculations = function()
    {
        LikeList = data["Activity"]["Like List"]["ItemFavoriteList"]

        var trueDate, dateTimeString, dateString, timeString
        for (var i = 0; i < LikeList.length; i++)
        //for (var i = 0; i < 10; i++)
        {
            trueDate = ShiftStringDateTime(LikeList[i]["Date"], TIME_CHANGE)
            dateTimeString = DateTimeToString(trueDate)
            dateString = a.split(dateTimeString, " ")[0]
            timeString = a.split(dateTimeString, " ")[1]

            if (dateString in LikeListDict)
            {
                LikeListDict[dateString].push(trueDate)
            }
            else
            {
                LikeListDict[dateString] = [trueDate]
            }
        }
        
        console.log("LikeListDict", LikeListDict)
    }

    ShiftStringDateTime = function(dateTimeString, shift)
    {
        var dateSplit = a.split(a.split(dateTimeString, " ")[0], "-")
        var timeSplit = a.split(a.split(dateTimeString, " ")[1], ":")
        var trueDate = new Date (
            dateSplit[0],
            parseInt(dateSplit[1]) + 1,
            dateSplit[2],
            parseInt(timeSplit[0]) + shift,
            timeSplit[1],
            timeSplit[2]
        )
        return trueDate
    }

    DateTimeToString = function(dateTime)
    {
        var string = dateTime.getFullYear() + "-"
        if (parseInt(dateTime.getMonth()) + 1 < 10)
        {
            string += "0"
        }
        string += (parseInt(dateTime.getMonth()) + 1) + "-"
        if (dateTime.getDate() < 10)
        {
            string += "0"
        }
        string += dateTime.getDate() + " "

        if (dateTime.getHours() < 10)
        {
            string += "0"
        }
        string += dateTime.getHours() + ":"
        if (dateTime.getMinutes() < 10)
        {
            string += "0"
        }
        string += dateTime.getMinutes() + ":"
        if (dateTime.getSeconds() < 10)
        {
            string += "0"
        }
        string += dateTime.getSeconds()

        return string
    }

    a.draw = function()
    {
        a.background(0, 0, 0)

        OverallStats()

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

            CalculateLikeTimes(i, SessionTimesDesc.margin + SessionTimesDesc.spacing*i)
        }
    }

    OverallStatsDesc =
    {
        x : 20,
        y : 40,
        width : 200,
        height : 200,
        spacing : 40
    }

    OverallStats = function()
    {
        a.push()
        a.fill(255)
        a.textAlign(a.CENTER, a.BASELINE)
        a.text("Overall Stats", OverallStatsDesc.x + OverallStatsDesc.width/2, OverallStatsDesc.y)

        a.textAlign(a.RIGHT, a.BASELINE)

        a.text("videos watched", OverallStatsDesc.x + OverallStatsDesc.width, OverallStatsDesc.y + OverallStatsDesc.spacing)
        a.text("videos liked", OverallStatsDesc.x + OverallStatsDesc.width, OverallStatsDesc.y + OverallStatsDesc.spacing * 2)
        a.text("% videos liked ", OverallStatsDesc.x + OverallStatsDesc.width, OverallStatsDesc.y + OverallStatsDesc.spacing * 3)

        
        a.push()
        a.fill(176, 215, 255)
        a.textSize(20)
        a.textAlign(a.LEFT, a.BASELINE)
        //-- total videos watched
        a.text(VideoList.length, OverallStatsDesc.x, OverallStatsDesc.y + OverallStatsDesc.spacing)
        //-- total videos liked
        a.text(LikeList.length, OverallStatsDesc.x, OverallStatsDesc.y + OverallStatsDesc.spacing * 2)
        //-- videos liked %
        var percent = parseInt(LikeList.length / VideoList.length * 1000)/100
        a.text(percent + "%", OverallStatsDesc.x, OverallStatsDesc.y + OverallStatsDesc.spacing * 3)
        a.pop()

        a.pop()
    }
    
    var SessionTimesDesc =
    {
        lineStartX : 275,
        lineEndX : 960,
        margin : 80,
        spacing : 40,
        transparency : 0.04,
        likePadding : 10,
        dotSize : 5
    }

    CalculateLikeTimes = function(inDay, lineY)
    {
        a.push()
        a.noStroke()
        a.fill(255, 181, 181, 3)
        a.ellipseMode(a.CENTER)
        var LikeListDictLength = Object.keys(LikeListDict).length
        var date
        var day
        var likeListDay
        var xValue
        for (var i = 0; i < LikeListDictLength; i++)
        {
            date = a.split(Object.keys(LikeListDict)[i], "-")
            day = new Date(date[0], date[1] - 1, date[2]).getDay()
            if (day == inDay)
            {
                likeListDay = Object.values(LikeListDict)[i]
                for (var t = 0; t < likeListDay.length; t++)
                {
                    xValue = a.map(TimeInMilliseconds(likeListDay[t]), 0, 86400000, SessionTimesDesc.lineStartX + SessionTimesDesc.dotSize, SessionTimesDesc.lineEndX - SessionTimesDesc.dotSize)
                    a.circle(xValue, lineY + SessionTimesDesc.likePadding, SessionTimesDesc.dotSize)
                }
            }
        }
        a.pop()
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
        a.stroke(188, 145, 255, 255*SessionTimesDesc.transparency)
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
                    start = a.map(TimeInMilliseconds(session[0]), 0, 86400000, lineStart.x, lineEnd.x)
                    end = a.map(TimeInMilliseconds(session[1]), 0, 86400000, lineStart.x, lineEnd.x)
                    a.line(start, lineY, end, lineY)
                }
            }
        }
        a.pop()
    }

    TimeInMilliseconds = function(Time)
    {
        return Time.getHours() * 3600000 + Time.getMinutes() * 60000 + Time.getSeconds() * 1000
        //return Time.getHours() * 3600000
    }

    CalculateVideoWatchFreq = function()
    {
        //--- VIDEOS WATCHED OVER TIME
        // drawing y axis
        a.push()
        a.stroke(252, 186, 3)
        a.strokeWeight(2)
        let lineY = 550
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
        let lineY = 700
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

