var Discord = require('discord.io')
var logger = require('winston')
var auth = require('./auth.json')

// Configure logger settings
logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, {
  colorize: true,
})

logger.level = 'debug'

// Initialize Discord Bot
// The Sneak Team Scrim bot responds to `!t` by default
var bot = new Discord.Client({
  token: auth.token,
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

  if (message.substring(0, 1) == '!t') {
    var args = message.substring(1).split(' ')
    var cmd = args[0]

    args = args.splice(1)
    switch(cmd) {
    case 'ping':
      bot.sendMessage({
        to: channelID,
        message: 'Pong!',
      })
      break
    default: break
    }
  }
})

