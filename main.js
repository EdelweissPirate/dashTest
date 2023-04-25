const express = require("express")
const app = express()
const path = require("path");

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/public/ARP-L_LESSON_2_IMPLEMENTATION_PART_1")));

const protect = require('./middleware/authMiddleware')
const getVideo = require('./controllers/videoController')

app.get("/getVideo", protect, getVideo);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
})

app.listen(3000)