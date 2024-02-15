const http = require("http")
const logger = require("./utils/logger")("server")

const server = http.createServer()
const PORT = 8000
const HEALTHCHECK = "/healthcheck"

server.listen(PORT)

server.on("listening", () => console.log(`server waiting on ${PORT} port`) )

server.on("request", (req, resp) => {
    if (req.url === HEALTHCHECK && req.method === "GET") {
        resp.writeHead(200, "OK")
        resp.write("healthcheck passed")
        logger.info(`method: ${req.method}, url: ${req.url}, status: ${resp.statusCode}`)
        resp.end()
        return
    }

    resp.writeHead(404, "Not found")

    logger.error(`method: ${req.method}, url: ${req.url}, status: ${resp.statusCode}`)
    resp.end()
})