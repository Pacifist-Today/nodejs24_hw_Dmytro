require('dotenv').config()

const config = require("config")
const logger = require("./utils/logger")('main')

// logger.info("Hello worlds")
logger.warn("Warn you")
logger.error('Some error')