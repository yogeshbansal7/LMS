const express = require("express")
const app = express()
const userRoutes = require("./routes/User")
const bookRoutes = require("./routes/Book")
const eventRoutes = require("./routes/Event")

const database = require("./config/database")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv")

const { cloudinaryConnect } = require("./config/cloudinary");

const PORT = process.env.PORT || 4000

dotenv.config()


database.connect()
cloudinaryConnect();

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)

app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/book", bookRoutes)
app.use("/api/v1/event", eventRoutes)

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  })
})

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`)
})
