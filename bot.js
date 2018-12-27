const logger = require('winston')
const teams = require('./teams')

const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  const channelID = msg.channel.id
  const serverID = client.channels[channelID].guild_id
  const server = client.servers[serverID]
  const message = msg.content

  const user = msg.author.username
  const userID = msg.author.id

  if (message.substring(0, 2) === '!t') {
    var args = message.substring(3).split(' ')
    var cmd = args[0]

    args = args.splice(1)

    if (cmd === 'ping') {
      client.reply('Pong!')
    }
    else if (cmd === 'create') {
      const teamName = getArgument(args, 0)

      teams.create(teamName, user, userID, (err) => {
        if (err) {
          msg.reply(`@${user} - ${err.message}`)
        } else {
          msg.reply(`@${user} - You have created the team \`${teamName}!\``)
        }
      })
    }
    else if (cmd === 'leave') {
      teams.leave(userID, (err) => {
        if (err) {
          msg.reply(`@${user} - ${err.message}`)
        } else {
          msg.reply(`@${user} - You have left your team.`)
        }
      })
    }
    else if (cmd === 'info') {
      teams.getTeamInformationEmbed(userID, server, (err, embedObj) => {
        if (err) {
          msg.reply(`@${user} - ${err.message}`)
        } else {
          msg.reply('', { embed: embedObj })
        }
      })
    }
  }

  if (msg.content === 'ping') {
    msg.reply('Pong!')
  }
})

const getArgument = (args, index) => {
  if (index >= args.length) {
    return null
  }

  return args[index]
}

client.login(process.env.BOT_TOKEN)

/*
module.exports = function() {
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

  bot.on('message', (user, userID, channelID, message, evt) => {
    evt // UNUSED


  })


}*/
