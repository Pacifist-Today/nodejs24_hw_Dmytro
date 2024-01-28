const {color} = require("colors/safe")
function logger (moduleName) {
    return {
        info: (...args) => console.info(color.save(moduleName), args)
    }
}