const loggerLevel = process.env.LOG_LEVEL === undefined ? "warn" : process.env.LOG_LEVEL
const colorSwitching = process.env.COLOR_ENABLED === '1' ? "COLOR_ENABLED" : "0"

module.exports = {
    isColorEnabled: colorSwitching,
    logLevel: loggerLevel
}