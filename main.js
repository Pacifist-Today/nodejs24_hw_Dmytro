const { logger } = require('./utils/logger');

const logging = logger('main')

logging.info('the script is running!');
logging.warn('the script is able to run!');
logging.error('Some error!');