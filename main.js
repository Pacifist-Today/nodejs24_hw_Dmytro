require('dotenv').config()
const config = require("config")

const logger = require("./utils/logger")('main')

logger.info('the script is running!')
logger.warn('the script is able to run!');
logger.error('Some error!');