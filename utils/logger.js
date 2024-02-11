const fs = require("fs")
const path = require("path")
const colors = require("colors")
const config = require('config')
const logLevel = config.logLevel

config.isColorEnabled ? colors.enable() : colors.disable()

const LOG_FOLDER = 'logs'

const infoPath = path.join(LOG_FOLDER, "info.log")
const errorsPath = path.join(LOG_FOLDER, "errors.log")

const logsFolderExists = fs.readdirSync(".").includes(LOG_FOLDER)

!logsFolderExists && fs.mkdirSync(LOG_FOLDER)

const infoLogStream = fs.createWriteStream(infoPath, {flags: "a"})
const errorLogStream = fs.createWriteStream(errorsPath, {flags: "a"})

function makeLogger (moduleName) {
    const info = (...args) => {

        writeLogsToFileStream(infoLogStream, JSON.stringify(args))
        if (logLevel === 'info') {
            console.info(colors.grey(moduleName), ...args)
        }
    }

    const warn = (...args) => {
        writeLogsToFileStream(errorLogStream, JSON.stringify(args))
        if (logLevel !== 'error') {
            console.warn(colors.yellow(moduleName), ...args)
        }
    }

    const error = (...args) => {
        writeLogsToFileStream(errorLogStream, JSON.stringify(args))
        console.error(colors.red(moduleName), ...args)
    }

    return {
        info,
        warn,
        error
    }
}

function writeLogsToFileStream(stream, ...args) {
    stream.write(`${new Date().toLocaleString()}: ${args}\n`)
}

process.once("beforeExit", () => {
    infoLogStream.end()
    errorLogStream.end()
})

module.exports = makeLogger