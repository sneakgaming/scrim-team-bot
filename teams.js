const logger = require('winston')
const db = require('./db')

// Returns the Embed object for a message containing team info
module.exports.getTeamInformationEmbed = (userID, server, callback) => {
  db.checkExists('teams', { members: userID }, (err, exists) => {
    if (err || !exists) {
      callback(new Error('You are not in a team. Use `!t create <name>` to create a team.'), null)
    }
    else if (exists) {
      db.findOne('teams', { members: userID }, (err, team) => {
        if (err) {
          callback(new Error('Could not leave team.'), null)
        } else {
          callback(null,  {
            color: 0xffffff,
            thumbnail: {
              url: 'https://imgur.com/7ROyWB4.png',
            },
            title: '⚐ Team Information ⚐',
            description: '',
            fields: [
              {
                name: `Name: ${team.name}`,
                value: team.description || 'No team description set.',
              },
              {
                name: 'Members',
                value: '• Captain: ToDo',
              },
              {
                name: 'Stats',
                value: '• Points: 0\n• Wins: 0',
              },
            ],
            footer: {
              icon_url: 'https://cdn.shopify.com/s/files/1/2351/3873/files/sneak-favicon_7a2ffde5-3653-4c4d-a14d-a2e94a2768d9_32x32.png?v=1540828357',
              text: `Team Size: ${team.members.length}/6`,
            },
          })
        }
      })
    }
  })
}

module.exports.leave = (userID, callback) => {
  db.checkExists('teams', { members: userID }, (err, exists) => {
    if (err) {
      callback(new Error('Could not leave team.'))
    } else if (!exists) {
      callback(new Error('You\'re not a team. Use `!t create` to create a team.'))
    } else {
      db.findOneAndUpdate('teams', { members: userID }, { '$pull': { members: userID } }, (err, result) => {
        if (err) {
          logger.error(err.message)
          callback(new Error('Could not leave team.'))
        } else if (result) {
          db.deleteMany('teams', { 'members.0': { '$exists': false } }, () => {
            callback(null)
          })
        }
      })
    }
  })
}

module.exports.create = (teamName, user, userID, callback) => {
  logger.info('Create Team')
  logger.info(teamName + ' ' + user + ' ', userID)

  if (teamName === null) {
    callback(new Error('No team name provided.'))
  }

  // Check if a team exists with this name
  db.checkExists('teams', { name: teamName }, (err, exists) => {
    if (err) {
      callback(new Error('Could not create the team. Please try again later.'))
    }

    if (exists) {
      callback(new Error(`A team already exists with the name \`${teamName}\``))
    } else {
      // Check if user is member of existing team
      db.checkExists('teams', { members: userID }, (err, exists) => {
        if (err) {
          callback(new Error('Could not create the team. Please try again later.'))
        }

        if (exists) {
          callback(new Error('You\'re already in a team. Use `!t leave` to leave your current team.'))
        } else {
          db.insertDocument('teams', { name: teamName, captain: userID, members:[userID] }, ()=>callback(null))
        }
      })
    }
  })
}
