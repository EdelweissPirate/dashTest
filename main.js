const express = require("express")
const app = express()
const path = require("path");

const protect = require('./middleware/authMiddleware')

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/public/ARP-L_LESSON_2_IMPLEMENTATION_PART_1")));

const getVideo = (req, res) => {
    let params = (new URL(req.headers.referer + req.url)).searchParams;

    const urlParams = new URLSearchParams(params);
    const videoName = urlParams.get('videoName')

    res.sendFile(__dirname + `/public/${videoName}/output.mpd`);
}

app.get("/getVideo", protect, getVideo);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
})

app.listen(3000)