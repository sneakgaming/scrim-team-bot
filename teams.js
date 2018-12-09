const logger = require('winston')

module.exports.create = (teamName, user, userID) => {
  logger.info('Create Team')
  logger.info(teamName + ' ' + user + ' ', userID)

  if (teamName === null) {
    return new Error('no team name provided')
  }

  return null
}
