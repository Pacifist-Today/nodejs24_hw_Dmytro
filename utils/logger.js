const colors = require("colors")
const config = require('config')
const logLevel = config.logLevel
config.isColorEnabled

function logger (moduleName) {
    const info = (...args) => console.info(colors.grey(moduleName), ...args)
    const warn = (...args) => console.warn(colors.yellow(moduleName), ...args)
    const error = (...args) => console.error(colors.red(moduleName), ...args)

    return loggsCalling(info, warn, error)
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
            info: () => new Error(),
            warn,
            error
        }
    } else if (logLevel === 'error') {
        return {
            info: () => new Error(),
            warn: () => new Error(),
            error
        }
    } else throw new Error("Incorrect logger level")
}

module.exports = logger