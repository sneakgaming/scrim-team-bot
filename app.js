const logger = require('winston')
const db = require('./db')

// Configure logger settings

logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, {
  colorize: true,
})
logger.level = 'debug'


// Initialise DB and then Bot

db.initialize(() => {
  require('./bot')()
})
