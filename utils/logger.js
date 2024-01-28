console.log("logger init")

function logger (moduleName) {
    return {
        info: (...args) => console.info(moduleName, ...args),
        warn: (...args) => console.warn(moduleName, ...args),
        error: (...args) => console.error(moduleName, ...args)
    }
}

function color () {
    return 'lol'
}

module.exports = logger