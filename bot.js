const Discord = require('discord.io')
const logger = require('winston')
const teams = require('./teams')

const MongoClient = require('mongodb').MongoClient
const assert = require('assert')


// Configure DB/Node
process.stdin.resume()

const url = process.env.MONGO_URI
const dbName = 'sneak-scrims-labs'
const mClient = new MongoClient(url)
var mDB

mClient.connect(function(err) {
  assert.strictEqual(null, err, 'Failed to connect to DB')
  logger.info('Connected successfully to DB')

  mDB = mClient.db(dbName)
})

function exitHandler(options, exitCode) {
  options, exitCode
  mClient.close()
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup:true }))

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit:true }))

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit:true }))
process.on('SIGUSR2', exitHandler.bind(null, { exit:true }))

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit:true }))


// Configure logger settings
logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, {
  colorize: true,
})
logger.level = 'debug'


// Configure Bot settings

var bot = new Discord.Client({
  token: process.env.BOT_TOKEN,
  autorun: true,
})

bot.on('ready', function (evt) {
  evt // UNUSED

  logger.info('Connected')
  logger.info('Logged in as: ')
  logger.info(bot.username + ' - (' + bot.id + ')')
})

bot.on('message', function (user, userID, channelID, message, evt) {
  evt // UNUSED

  if (message.substring(0, 2) === '!t') {
    var args = message.substring(3).split(' ')
    var cmd = args[0]

    args = args.splice(1)

    if (cmd === 'ping') {
      bot.sendMessage({ to: channelID, message: 'Pong!' })
    }
    else if (cmd === 'create') {
      const teamName = getArgument(args, 0)
      const err = teams.create(mDB, teamName, user, userID)

      if (err !== null) {
        bot.sendMessage({ to: channelID, message: `Could not create team. ${err}` })
      } else {
        bot.sendMessage({ to: channelID, message: 'Team Created.' })
      }
    }
  }
})

const getArgument = (args, index) => {
  if (index >= args.length) {
    return null
  }

  return args[index]
}
