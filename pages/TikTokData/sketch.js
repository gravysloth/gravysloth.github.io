
var TikTokData = function(a)
{
    let data = {}
    let VideoList = {}

    var VideoListDict = {}
    var Days = ["S", "M", "T", "W", "Th", "F", "S"]
    var VideoListDayFreq = [0, 0, 0, 0, 0, 0, 0]

    a.preload = function()
    {
        data = a.loadJSON("data/user_data.json")
        console.log("json loaded")
    }

    a.setup = function()
    {
        var canvas = a.createCanvas(1000, 600)
        canvas.parent("sketch")
        a.frameRate(30)
        
        VideoList = data["Activity"]["Video Browsing History"]["VideoList"]

        for (var i = 0; i < VideoList.length; i++)
        {
            var date = a.split(VideoList[i]["Date"], " ")[0]
            var dateFormatted = new Date(a.split(date, "-")[0], a.split(date, "-")[1]-1, a.split(date, "-")[2])
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
        }
        console.log(VideoListDict)
        console.log(VideoListDayFreq)

        a.textFont('Courier New')
        a.background(0, 0, 0)
        WatchHistory()
    }

    a.draw = function()
    {
        // a.background(66, 135, 245)

        // WatchHistory()
    }

    WatchHistory = function()
    {
        VideoWatchFreq()
        VideosPerDayOfWeek()
    }

    VideoWatchFreq = function()
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

        var largestFreq = 1205
        var maxHeight = 200

        for (var i = 0; i < VideoListDictLength; i++)
        {
            a.push()
            a.noStroke()
            a.fill(50, 168, 82)
            var width = (lineEnd.x - lineStart.x)/VideoListDictLength
            var xValue = a.map(Object.values(VideoListDict)[i].date.getTime(), firstTime, lastTime, lineStart.x + width/2, lineEnd.x - width/2)
            var height = Object.values(VideoListDict)[i].frequency*(maxHeight/largestFreq)
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

