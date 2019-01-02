const logger = require('winston')
const teams = require('./teams')

const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`)
  client.user.setActivity('your commands', { type: 'LISTENING' })
})

client.on('message', msg => {
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
      teams.getTeamInformationEmbed(userID, client, (err, embedObj) => {
        if (err) {
          msg.reply(`@${user} - ${err.message}`)
        } else {
          msg.reply('', { embed: embedObj })
        }
      })
    }
    else if (cmd === 'invite') {
      const userToInvite = getArgument(args, 0)
      const inviteeID = userToInvite.replace(/[<@!>]/g, '')

      teams.invite(userID, client, inviteeID, (err, embed) => {
        if (err) {
          msg.reply(`@${user} - ${err.message}`)
        } else {
          msg.reply(`@${user} - You have successfully invited a user.`)
        }
      })
    }
  }
})

const getArgument = (args, index) => {
  if (index >= args.length) {
    return null
  }

  return args[index]
}

module.exports.default = client
