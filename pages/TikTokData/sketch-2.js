
var TikTokData = function(a)
{
    let PERSON = "andrea"
    let TIME_CHANGE = -7
    let TEXT_SIZE = 12
    let MARGIN = 40

    let data = {}
    let VideoList = {}

    var VideoListDict = {}
    var VideoListLargestFreq = 0

    var Days = ["S", "M", "T", "W", "Th", "F", "S"]
    var VideoListDayFreq = [0, 0, 0, 0, 0, 0, 0]
    var VideoListDayLargestFreq = 0
    var VideoListLongestTimeSpent = 0
    var MostLikesPerMinute = 0

    var TimesOnlineDict = {}
    var TimesOnlineCount = 0
    var SessionLengths = []
    var TotalTimeSpent = 0

    var LikeList = {}
    var LikeListDict = {}

    a.preload = function()
    {
        data = a.loadJSON("data/" + PERSON + "_user_data.json")
        console.log("json loaded")
    }

    a.setup = function()
    {
        a.pixelDensity(2)
        var canvas = a.createCanvas(1000, 800)
        canvas.parent("sketch")
        a.frameRate(30)
        a.noLoop()
        a.textFont('Courier New')
        a.textSize(TEXT_SIZE)
        a.strokeCap(a.ROUND)
        
        VideoListCalculations()
        
        LikeListCalculations()

        console.log(OverallStatsDesc)

        console.log("VideoListDict", VideoListDict)
        // console.log("VideoListDayFreq", VideoListDayFreq)
        // console.log("TimesOnlineCount", TimesOnlineCount)
        console.log("TimesOnlineDict", TimesOnlineDict)
        // console.log("VideoListLargestFreq", VideoListLargestFreq)
        // console.log("VideoListDayLargestFreq", Video  ListDayLargestFreq)
        // console.log("TotalTimeSpent", TotalTimeSpent)
    }

    VideoListCalculations = function()
    {
        VideoList = data["Activity"]["Video Browsing History"]["VideoList"]
        var dateSplit = a.split(a.split(VideoList[0]["Date"], " ")[0], "-")
        var timeSplit = a.split(a.split(VideoList[0]["Date"], " ")[1], ":")
        var trueDateTime = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], timeSplit[0], timeSplit[1], timeSplit[2])
        var dateString, lastDateString
        var timeString
        var lastDateTime = trueDateTime

        var BREAK_INTERVAL = 600000
        
        var sessionStart = lastDateTime
        var sessionEnd = lastDateTime
        var sessionDuration

        for (var i = 0; i < VideoList.length; i++)
        //for (var i = 0; i < 100; i++)
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
            dateString = a.split(DateTimeToString(trueDateTime), " ")[0]
            dateSplit = a.split(dateString, "-")

            //-- Calculate true timeString and true timeSplit
            timeString = a.split(DateTimeToString(trueDateTime), " ")[1]
            timeSplit = a.split(timeString, ":")

            //-- Add gaps to VideoListDict
            if (Math.abs(trueDateTime - lastDateTime) > 1000 * 60 * 60 * 24)
            {
                var gapDate = new Date(lastDateTime)
                gapDate.setDate(gapDate.getDate() - 1)
                gapDate.setHours(0)
                gapDate.setMinutes(0)
                gapDate.setSeconds(0)
                var trueDateTimeCompare = new Date(trueDateTime)
                trueDateTimeCompare.setHours(0)
                trueDateTimeCompare.setMinutes(0)
                trueDateTimeCompare.setSeconds(0)
                var gapDateString, gapDateFormatted
                while (Math.abs(gapDate - trueDateTimeCompare) >= 1000 * 60 * 60 * 24)
                {
                    gapDateString = a.split(DateTimeToString(gapDate), " ")[0]
                    gapDateFormatted = new Date(gapDate)
                    gapDateFormatted.setHours(0)
                    gapDateFormatted.setMinutes(0)
                    gapDateFormatted.setSeconds(0)
                    VideoListDict[gapDateString] = new VideoListData(gapDateFormatted)

                    gapDate.setDate(gapDate.getDate() - 1)
                }
            }
            //-- Add to VideoListDict
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

            if (Math.abs(trueDateTime - lastDateTime) > BREAK_INTERVAL)
            {
                TimesOnlineCount++
                sessionStart = lastDateTime

                if (lastDateString in TimesOnlineDict)
                {
                    TimesOnlineDict[lastDateString].push([sessionStart, sessionEnd])
                }
                else
                {
                    TimesOnlineDict[lastDateString] = [[sessionStart, sessionEnd]]
                }
                sessionDuration = sessionEnd - sessionStart
                TotalTimeSpent = parseInt(TotalTimeSpent) + parseInt(sessionDuration)
                VideoListDict[dateString].addTime(sessionDuration)

                sessionEnd = trueDateTime
            }

            lastDateString = dateString
            lastDateTime = trueDateTime
        }

        // Calculate largest values
        for (var i = 0; i < Object.keys(VideoListDict).length; i++)
        {
            if (Object.values(VideoListDict)[i].frequency > VideoListLargestFreq)
            {
                VideoListLargestFreq = Object.values(VideoListDict)[i].frequency
            }
            if (Object.values(VideoListDict)[i].timeSpent > VideoListLongestTimeSpent)
            {
                VideoListLongestTimeSpent = Object.values(VideoListDict)[i].timeSpent
            }
        }

        for (var i = 0; i < VideoListDayFreq.length; i++)
        {
            if (VideoListDayFreq[i] > VideoListDayLargestFreq)
            {
                VideoListDayLargestFreq = VideoListDayFreq[i];
            }
        }
    }

    LikeListCalculations = function()
    {
        LikeList = data["Activity"]["Like List"]["ItemFavoriteList"]

        var trueDate, dateTimeString, dateString, timeString
        for (var i = 0; i < LikeList.length; i++)
        //for (var i = LikeList.length - 10; i < LikeList.length; i++)
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

            if (dateString in VideoListDict)
            {
                VideoListDict[dateString].likes += 1
            }
        }
        var maxthing = 0
        // Calculate like percent and likes per minute
        for (var i = 0; i < Object.keys(VideoListDict).length; i++)
        {
            Object.values(VideoListDict)[i].likePercent = Object.values(VideoListDict)[i].likes / Object.values(VideoListDict)[i].frequency

            if (Object.values(VideoListDict)[i].timeSpent / (1000 * 60) > 0)
            {
                Object.values(VideoListDict)[i].likesPerMinute = Object.values(VideoListDict)[i].likes / (Object.values(VideoListDict)[i].timeSpent / (1000 * 60))

                if (MostLikesPerMinute < Object.values(VideoListDict)[i].likesPerMinute)
                {
                    maxthing = i
                }
    
                MostLikesPerMinute = Math.max(MostLikesPerMinute, Object.values(VideoListDict)[i].likesPerMinute)
            }
        }
    }

    ShiftStringDateTime = function(dateTimeString, shift)
    {
        var dateSplit = a.split(a.split(dateTimeString, " ")[0], "-")
        var timeSplit = a.split(a.split(dateTimeString, " ")[1], ":")
        var trueDate = new Date (
            dateSplit[0],
            parseInt(dateSplit[1]) - 1,
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
        
        a.push()
        a.textAlign(a.CENTER, a.TOP)
        a.fill(255)
        a.text("When I'm Online", (SessionTimesDesc.lineEndX - SessionTimesDesc.lineStartX) / 2 + SessionTimesDesc.lineStartX, SessionTimesDesc.margin - SessionTimesDesc.spacing)
        a.pop()
        DrawSessionTimesPeripherals()
        for (var i = 0; i < 7; i++)
        {
            CalculateSessionTimes(i, SessionTimesDesc.margin + SessionTimesDesc.spacing*i)

            CalculateLikeTimes(i, SessionTimesDesc.margin + SessionTimesDesc.spacing*i)
        }

        a.push()
        a.textAlign(a.CENTER, a.BASELINE)
        a.fill(255)
        a.text("Usage Over Time", (VideoWatchDesc.lineEndX - VideoWatchDesc.lineStartX) / 2 + VideoWatchDesc.lineStartX, VideoWatchDesc.lineY - VideoWatchDesc.maxHeight - 15)
        a.pop()

        DrawTimeSpentEachDay()
        CalculateVideoWatchFreq()
    }

    var OverallStatsDesc =
    {
        x : MARGIN,
        y : MARGIN,
        width : 200,
        height :  200,
        spacing : 40,
        fontSize : 12
    }

    OverallStats = function()
    {
        a.push()
        a.textSize(OverallStatsDesc.fontSize)
        a.fill(255)
        a.textAlign(a.CENTER, a.BASELINE)
        a.text("Overall Stats", OverallStatsDesc.x + OverallStatsDesc.width/2, OverallStatsDesc.y)

        a.textAlign(a.RIGHT, a.BASELINE)

        a.text("videos watched", OverallStatsDesc.x + OverallStatsDesc.width, OverallStatsDesc.y + OverallStatsDesc.spacing)
        a.text("videos liked", OverallStatsDesc.x + OverallStatsDesc.width, OverallStatsDesc.y + OverallStatsDesc.spacing * 2)
        a.text("% videos liked", OverallStatsDesc.x + OverallStatsDesc.width, OverallStatsDesc.y + OverallStatsDesc.spacing * 3)
        a.text("time spent", OverallStatsDesc.x + OverallStatsDesc.width, OverallStatsDesc.y + OverallStatsDesc.spacing * 4)
        a.text("avg minutes a day", OverallStatsDesc.x + OverallStatsDesc.width, OverallStatsDesc.y + OverallStatsDesc.spacing * 5)
        a.pop()
        
        a.push()
        a.textSize(OverallStatsDesc.fontSize)
        a.fill(176, 215, 255)
        a.textAlign(a.LEFT, a.BASELINE)
        //-- total videos watched
        a.text(VideoList.length, OverallStatsDesc.x, OverallStatsDesc.y + OverallStatsDesc.spacing)
        //-- total videos liked
        a.text(LikeList.length, OverallStatsDesc.x, OverallStatsDesc.y + OverallStatsDesc.spacing * 2)
        //-- videos liked %
        var percent = parseInt(LikeList.length / VideoList.length * 100 * 100)/100
        a.text(percent + "%", OverallStatsDesc.x, OverallStatsDesc.y + OverallStatsDesc.spacing * 3)
        //-- time spent
        var TTScopy = TotalTimeSpent
        var weeksSpent = parseInt(TTScopy / 1000 / 60 / 60 / 24 / 7)
        TTScopy -= weeksSpent * 1000 * 60 * 60 * 24 * 7

        var daysSpent = parseInt(TTScopy / 1000 / 60 / 60 / 24)
        TTScopy -= daysSpent * 1000 * 60 * 60 * 24

        var hoursSpent = parseInt(TTScopy / 1000 / 60 / 60)
        TTScopy -= hoursSpent * 1000 * 60 * 60

        var minutesSpent = parseInt(TTScopy / 1000 / 60)
        TTScopy -= minutesSpent * 1000 * 60 * 60

        a.text(weeksSpent + "w " + daysSpent + "d " + hoursSpent + "h ", OverallStatsDesc.x, OverallStatsDesc.y + OverallStatsDesc.spacing * 4)
        //-- average time spent
        var totalMinutesSpent = TotalTimeSpent / 1000 / 60
        a.text(parseInt(totalMinutesSpent / Object.keys(VideoListDict).length), OverallStatsDesc.x, OverallStatsDesc.y + OverallStatsDesc.spacing * 5)

        a.pop()
    }
    
    var SessionTimesDesc =
    {
        lineStartX : 290,
        lineEndX : 960,
        margin : 80,
        spacing : 40,
        transparency : 0.03,
        likeTransparency : 2,
        likePadding : 10,
        dotSize : 5
    }

    CalculateLikeTimes = function(inDay, lineY)
    {
        SessionTimesDesc.likeTransparency = 600 / LikeList.length
        a.push()
        a.noStroke()
        a.fill(255, 181, 181, 255 * SessionTimesDesc.likeTransparency)
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
        a.noStroke()
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

    var VideoWatchDesc =
    {
        lineStartX : 40,
        lineEndX : 960,
        lineY : 575,
        textPadding : 2,
        maxHeight : 180,
        linePointNum : 25
    }

    CalculateVideoWatchFreq = function()
    {
        //--- VIDEOS WATCHED OVER TIME
        let lineY = VideoWatchDesc.lineY
        let lineStart = a.createVector(VideoWatchDesc.lineStartX, lineY)
        let lineEnd = a.createVector(VideoWatchDesc.lineEndX, lineY)

        // draw the bars
        var VideoListDictLength = Object.keys(VideoListDict).length
        var firstTime = Object.values(VideoListDict)[VideoListDictLength - 1].date.getTime()
        var lastTime = Object.values(VideoListDict)[0].date.getTime()
        var numOfDays = (lastTime - firstTime) / (1000 * 3600 * 24)
        var maxHeight = VideoWatchDesc.maxHeight
        var width = (lineEnd.x - lineStart.x)/numOfDays

        // variables for line
        var averageInterval = parseInt(VideoListDictLength / VideoWatchDesc.linePointNum)
        var averageTotal = 0
        var average
        var pointX, pointY

        // markers
        var lastYear = Object.values(VideoListDict)[0].date.getFullYear()
        var lastMonth = Object.values(VideoListDict)[0].date.getMonth()
        var monthMarkers = []

        a.push()
        a.noStroke()
        a.fill(96, 142, 191)

        a.beginShape()
        for (var i = 0; i < VideoListDictLength; i++)
        {
            var xValue = a.map(Object.values(VideoListDict)[i].date.getTime(), firstTime, lastTime, lineStart.x + width/2, lineEnd.x - width/2)
            var height = Object.values(VideoListDict)[i].frequency*(maxHeight/VideoListLargestFreq)
            a.rect(xValue - width/2, lineY - height, width, height)
            
            // draw like ratio
            var dateKey = Object.keys(VideoListDict)[i]
            if (dateKey in LikeListDict && Object.values(VideoListDict)[i].frequency > 100)
            {
                a.push()
                a.stroke(255, 0, 0)
                a.strokeWeight(3)
                var yLikeRatioValue = lineY - Object.values(VideoListDict)[i].likePercent * maxHeight
                a.point(xValue, yLikeRatioValue)
                a.pop()
            }

            // year markers
            if (lastYear != Object.values(VideoListDict)[i].date.getFullYear() && Object.values(VideoListDict)[i].date != "Invalid Date" && !isNaN(lastYear))
            {
                a.push()
                a.fill(255)
                a.textAlign(a.CENTER, a.TOP)
                a.text(Object.values(VideoListDict)[i].date.getFullYear(), xValue, lineY + VideoWatchDesc.textPadding)
                a.pop()
            }

            // month markers
            if (lastMonth != Object.values(VideoListDict)[i].date.getMonth() && Object.values(VideoListDict)[i].date != "Invalid Date" && !isNaN(lastMonth))
            {
                monthMarkers.push(xValue)
            }

            // draw highest freq
            if (Object.values(VideoListDict)[i].frequency == VideoListLargestFreq)
            {
                a.push()
                a.fill(96, 142, 191)
                a.noStroke()
                a.textAlign(a.CENTER, a.BASELINE)
                a.text(VideoListLargestFreq + " videos", xValue, lineY - height - VideoWatchDesc.textPadding)
                a.pop()
            }

            // draw line
            averageTotal += Object.values(VideoListDict)[i].frequency
            if (i == VideoListDictLength - 1)
            {
                pointX = lineStart.x
                a.curveVertex(pointX, pointY)
                a.curveVertex(pointX, pointY)

                averageTotal = 0
            }
            if (i == parseInt(averageInterval / 2))
            {
                average = averageTotal / (averageInterval / 2)
                pointX = lineEnd.x
                pointY = lineY - average*(maxHeight/VideoListLargestFreq)
                a.curveVertex(pointX, pointY)
                a.curveVertex(pointX, pointY)

                averageTotal = 0
            }
            if (i%averageInterval == 0 && i != 0)
            {
                average = averageTotal / averageInterval
                pointX = a.map(Object.values(VideoListDict)[i - parseInt(averageInterval/2)].date.getTime(), firstTime, lastTime, lineStart.x + width/2, lineEnd.x - width/2)
                pointY = lineY - average*(maxHeight/VideoListLargestFreq)
                a.curveVertex(pointX, pointY)

                averageTotal = 0
            }

            lastYear = Object.values(VideoListDict)[i].date.getFullYear()
            lastMonth = Object.values(VideoListDict)[i].date.getMonth()
        }
        a.pop()

        a.push()
        a.strokeWeight(2)
        a.stroke(147, 182, 219)
        a.noFill()
        a.endShape()
        a.pop()

        // draw labels
        // a.push()
        // a.fill(255)
        // a.textAlign(a.RIGHT, a.TOP)
        // var date = Object.values(VideoListDict)[0].date
        // var dateString = a.split(date.toString(), " ")[1] + " " + a.split(date.toString(), " ")[3]
        // a.text(dateString, lineEnd.x, lineY + VideoWatchDesc.textPadding)
        // a.textAlign(a.LEFT, a.TOP)
        // date = Object.values(VideoListDict)[VideoListDictLength - 1].date
        // dateString = a.split(date.toString(), " ")[1] + " " + a.split(date.toString(), " ")[3]
        // a.text(dateString, lineStart.x, lineY + VideoWatchDesc.textPadding)
        // a.pop()

        // draw month markers
        for (var i = 0; i < monthMarkers.length; i++)
        {
            a.push()
            a.fill(255, 255, 255, 200)
            a.noStroke()
            a.rectMode(a.CENTER)
            a.ellipseMode(a.CENTER)
            // a.rect(monthMarkers[i], lineY, width, 10)
            a.circle(monthMarkers[i], lineY, 3)
            a.pop()
        }

        a.push()
        a.fill(96, 142, 191)
        a.textAlign(a.LEFT, a.BASELINE)
        a.translate(lineStart.x - 10, lineY - 5)
        a.rotate(a.radians(-90))
        a.text("Videos Watched", 0, 0)
        a.pop()
    }

    DrawTimeSpentEachDay = function()
    {
        //--- VIDEOS WATCHED OVER TIME
        let lineY = VideoWatchDesc.lineY
        let lineStart = a.createVector(VideoWatchDesc.lineStartX, lineY)
        let lineEnd = a.createVector(VideoWatchDesc.lineEndX, lineY)

        // draw the bars
        var VideoListDictLength = Object.keys(VideoListDict).length
        var firstTime = Object.values(VideoListDict)[VideoListDictLength - 1].date.getTime()
        var lastTime = Object.values(VideoListDict)[0].date.getTime()
        var numOfDays = (lastTime - firstTime) / (1000 * 3600 * 24)
        var maxHeight = VideoWatchDesc.maxHeight
        var width = (lineEnd.x - lineStart.x)/numOfDays

        a.push()
        a.noStroke()
        a.fill(106, 161, 95)

        // variables for line
        var averageInterval = parseInt(VideoListDictLength / VideoWatchDesc.linePointNum)
        var averageTotal = 0
        var average
        var pointX, pointY

        a.beginShape()
        for (var i = 0; i < VideoListDictLength; i++)
        {
            var xValue = a.map(Object.values(VideoListDict)[i].date.getTime(), firstTime, lastTime, lineStart.x + width/2, lineEnd.x - width/2)
            var height = Object.values(VideoListDict)[i].timeSpent*(maxHeight/VideoListLongestTimeSpent)
            // a.rect(xValue - width/2, lineY - height, width, height)
            a.rect(xValue - width/2, lineY, width, height)
            
            // draw like ratio
            var dateKey = Object.keys(VideoListDict)[i]
            if (dateKey in LikeListDict && Object.values(VideoListDict)[i].frequency > 100)
            {
                a.push()
                a.stroke(255, 0, 0)
                a.strokeWeight(3)
                var yLikeRatioValue = lineY + Object.values(VideoListDict)[i].likesPerMinute * (maxHeight/MostLikesPerMinute)
                a.point(xValue, yLikeRatioValue)
                a.pop()
            }

            // draw most time spent
            if (Object.values(VideoListDict)[i].timeSpent == VideoListLongestTimeSpent)
            {
                a.push()
                a.fill(106, 161, 95)
                a.noStroke()
                a.textAlign(a.CENTER, a.TOP)
                var hours = parseInt(VideoListLongestTimeSpent / 1000 / 60 / 60 * 10) / 10
                a.text(hours + " hours", xValue, lineY + height + VideoWatchDesc.textPadding)
                a.pop()
            }

            // draw line
            averageTotal += Object.values(VideoListDict)[i].timeSpent
            if (i == VideoListDictLength - 1)
            {
                pointX = lineStart.x
                a.curveVertex(pointX, pointY)
                a.curveVertex(pointX, pointY)

                averageTotal = 0
            }
            if (i == parseInt(averageInterval / 2))
            {
                average = averageTotal / (averageInterval / 2)
                pointX = lineEnd.x
                pointY = lineY + average*(maxHeight/VideoListLongestTimeSpent)
                a.curveVertex(pointX, pointY)
                a.curveVertex(pointX, pointY)

                averageTotal = 0
            }
            if (i%averageInterval == 0 && i != 0)
            {
                average = averageTotal / averageInterval
                pointX = a.map(Object.values(VideoListDict)[i - parseInt(averageInterval/2)].date.getTime(), firstTime, lastTime, lineStart.x + width/2, lineEnd.x - width/2)
                pointY = lineY + average*(maxHeight/VideoListLongestTimeSpent)
                a.curveVertex(pointX, pointY)

                averageTotal = 0
            }
        }
        a.pop()

        a.push()
        a.strokeWeight(2)
        a.stroke(174, 227, 163)
        a.noFill()
        a.endShape()
        a.pop()

        a.push()
        a.fill(106, 161, 95)
        a.textAlign(a.RIGHT, a.BASELINE)
        a.translate(lineStart.x - 10, lineY + 5)
        a.rotate(a.radians(-90))
        a.text("Time Spent", 0, 0)
        a.pop()
    }

    VideosPerDayOfWeek = function()
    {
        //--- VIDEOS PER DAY OF WEEK
        // drawing y axis
        a.push()
        a.stroke(252, 186, 3)
        a.strokeWeight(2)
        let lineY = SessionTimesDesc.margin + SessionTimesDesc.spacing * 6.5
        let lineStart = a.createVector(OverallStatsDesc.x, lineY)
        let lineEnd = a.createVector(OverallStatsDesc.x + OverallStatsDesc.width, lineY)
        // a.line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y)
        a.pop()

        // draw the bars
        var maxHeight = 60
        var bottomSpacing = 10
        var strokeWeight = 10
        a.beginShape()
        for (var i = 0; i < VideoListDayFreq.length; i++)
        {
            // Draw bars
            a.push()
            a.stroke(96, 142, 191, 100)
            a.strokeWeight(strokeWeight)
            a.strokeCap(a.ROUND)
            var xValue = a.map(i, 0, 6, lineStart.x + strokeWeight/2, lineEnd.x - strokeWeight/2)
            var height = VideoListDayFreq[i]*(maxHeight/VideoListDayLargestFreq)
            // a.rect(xValue - width/2, lineY - height, width, height)
            a.line(xValue, lineY - bottomSpacing, xValue, lineY - height - bottomSpacing)
            
            // Draw labels
            a.push()
            a.noStroke()
            a.textAlign(a.CENTER, a.TOP)
            a.fill(255)
            a.text(Days[i], xValue, lineY)
            a.pop()

            // Draw line
            if (i == 0)
            {
                xValue -= strokeWeight/2
                a.curveVertex(xValue, lineY - height - bottomSpacing)
            }
            else if (i == VideoListDayFreq.length - 1)
            {
                xValue += strokeWeight/2
                a.curveVertex(xValue, lineY - height - bottomSpacing)
            }
            a.curveVertex(xValue, lineY - height - bottomSpacing)
            a.pop()
        }
        a.push()
        a.noFill()
        a.stroke(96, 142, 191)
        a.strokeWeight(2)
        a.endShape()
        a.pop()
    }

    class VideoListData
    {
        constructor(date)
        {
            this.date = date
            this.frequency = 0
            this.timeLinkDict = {}
            this.timeSpent = 0
            this.likes = 0
            this.likePercent = 0
            this.likesPerMinute = 0
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

        addTime = function(duration)
        {
            this.timeSpent += duration
        }
    }
}

var TikTokDataP5 = new p5(TikTokData, "sketch")

