const fs = require("fs")
const promise = require("fs/promises")
const EventEmitter = require("events")
const path = require("path")
const colors = require("colors")
const config = require('config')
const logLevel = config.logLevel

config.isColorEnabled ? colors.enable() : colors.disable()

const logsPath = path.join(".", "logs")
const infoPath = path.join(logsPath, "info.log")
const errorsPath = path.join(logsPath, "errors.log")

const isLogsDir = fs.readdirSync(".").includes(logsPath)

!isLogsDir ? fs.mkdirSync(logsPath) : null

const writeInfo = fs.createWriteStream(infoPath, {flags: "a"})
const writeErrors = fs.createWriteStream(errorsPath, {flags: "a"})

// process.once("before exit", () => {
//     writeInfo.end()
//     writeErrors.end()
//     console.log("before exit")
// })

function logger (moduleName) {
    const info = (...args) => {
        writeLogs("info", ...args)
        console.info(colors.grey(moduleName), ...args)
    }
    const warn = (...args) => {
        writeLogs("warn", ...args)
        console.warn(colors.yellow(moduleName), ...args)
    }
    const error = (...args) => {
        writeLogs("error", ...args)
        console.error(colors.red(moduleName), ...args)
    }

    return loggsCalling(info, warn, error)
}

function writeLogs(logType, ...args) {
    if (logType === "info") {
        writeInfo.write(`${new Date().toLocaleString()}: ${args}\n`)
    } else if (logType === "error" || logType === "warn") {
        writeErrors.write(`${new Date().toLocaleString()}: ${args}\n`)
    } else throw new Error("Incorrect logType")
}

function loggsCalling(info, warn, error) {
    if (logLevel === 'info') {
        return {
            info,
            warn,
            error
        }
    }
    else if (logLevel === 'warn') {
        return {
            info: (...args) => writeLogs("info", args),
            warn,
            error
        }
    }
    else if (logLevel === 'error') {
        return {
            info: (...args) => writeLogs("info", args),
            warn: (...args) => writeLogs("warn", args),
            error
        }
    }
    else throw new Error("Incorrect logger level")
}

module.exports = logger