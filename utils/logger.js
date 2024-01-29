const colors = require("colors")
const config = require('config')
const logLevel = config.logLevel

config.isColorEnabled === '1' ? colors.enable() : colors.disable()

function logger (moduleName) {
    info = (...args) => console.info(colors.grey(moduleName), ...args)
    warn = (...args) => console.warn(colors.yellow(moduleName), ...args)
    error = (...args) => console.error(colors.red(moduleName), ...args)
    if (logLevel === 'info') {
        return {
            info,
            warn,
            error
        }
    }
    else if (logLevel === 'warn') {
        return {
            warn,
            error
        }
    } else {
        return {
            error
        }
    }
}

module.exports = logger