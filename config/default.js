const loggerLevel = process.env.LOG_LEVEL === undefined ? "warn" : process.env.LOG_LEVEL

const colors = require("colors")
const colorSwitching = process.env.COLOR_ENABLED === '1' ? colors.enable() : colors.disable()

module.exports = {
    isColorEnabled: colorSwitching,
    logLevel: loggerLevel
}