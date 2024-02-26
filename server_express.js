require("dotenv").config()
const config = require("config")

const morgan = require("morgan")
const rfs = require("rotating-file-stream")
const express = require("express")

const logger = require("./utils/logger")("express", config.logger)

const { router: userRouter } = require("./routes/express_routes")

const server = express()

const jsonBodyParser = express.json()
server.use(jsonBodyParser)

const logStream = rfs.createStream("endpoints.log", {
    interval: "7d",
    path: ("./logs")
})

server.use(morgan("dev", { stream: logStream }))
server.use(morgan("dev"))

server.listen(8000, () => logger.info("express server is running on 8000"))

server.use("/users", userRouter)