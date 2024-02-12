require('dotenv').config()
const fileSync = require("./file_sync")

const logger = require('./utils/logger')('main');

logger.info('this is logged object to INFO', { testKey: 'some value' })
logger.warn('this is logged object to WARN', { testKey: 'some value' })
logger.error('this is logged object to ERROR', { testKey: 'some value' })

fileSync.start()