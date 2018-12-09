const logger = require('winston')

module.exports.create = (db, teamName, user, userID) => {
  logger.info('Create Team')
  logger.info(teamName + ' ' + user + ' ', userID)

  if (teamName === null) {
    return new Error('no team name provided')
  }

  insertDocuments(db, (r) => {
    logger.info(r)
  })

  return null
}


const insertDocuments = (db, callback) => {
  // Get the documents collection
  const collection = db.collection('teams')
  // Insert some documents
  collection.insertMany([
    { a : 1 }, { a : 2 }, { a : 3 },
  ], function(err, result) {
    callback(result)
  })
}
