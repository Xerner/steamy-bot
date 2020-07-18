'use strict';

const {
  prefix, //
  iprefix,
  allowInternal
} = require('../../config.json');

// Message Validation
function validateMessage(message, musicQueue, _prefix, commandName, args) {
  if (message.author.bot) return false; // if the message came from a bot, do nothing
  if (!(_prefix == prefix || (allowInternal && _prefix == iprefix))) return false; // ignore messages not starting with the prefix or iprefix
  // Split message into commandName and arguments. Ignore prefix
  var command;
  // Get command from respective collection    
  if (allowInternal && _prefix == iprefix) {
    command =
      message.client.internalCommands.get(commandName) ||
      message.client.internalCommands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );      
  } else {
    command =
      message.client.commands.get(commandName) ||
      message.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
  }
  // Ignore commands that don't exists
  if (!command) {
    console.log('Command not found in command collections');
    return false;
  }
  // Check if args are needed
  if (command.args && !args.length) {
    let reply = `Gonna need more than that 🙌, ${message.author}`;
    if (command.usage) {
      reply += `\nProper usage: \`${prefix}${command.name} ${command.usage}\``;
    } else {
      reply += `\nProper usage: \`${prefix}${command.name}\``;
    }
    message.channel.send(reply);
    return false;
  }  
  // // Check if user needs to be in a voice channel
  if (command.requireVoice) {
    if (!message.member.voice.channel) {      
      message.channel.send('You have to be in a voice channel to do that');
      return false;
    }
    // Music commands require people to be in the same voice channel as the bot
    if (musicQueue.voiceChannel) {
      if (musicQueue.voiceChannel.id !== message.member.voice.channel.id) {
        message.channel.send('You have to be in the same channel as me to do that');
        return false;
      }
    }
  }
  console.log('Message successfully validated!');
  return true;
}

module.exports = validateMessage;