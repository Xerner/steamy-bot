// Music features were made with help from Gabriel Tanners guide on how to make a music bot
// https://gabrieltanner.org/blog/dicord-music-bot
//
// Command handler, cooldowns, winston logger, some validation, and command object structure taken from
// https://discordjs.guide/
// https://discordjs.guide/command-handling/
// https://discordjs.guide/command-handling/adding-features.html#cooldowns
// https://discordjs.guide/miscellaneous/useful-packages.html#winston
// ------------------------------------------------------------------------------------------------
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

// Make command handler
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/main').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/main/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}
// Make internal command handler
client.internalCommands = new Discord.Collection();
const internalCommandFiles = fs
  .readdirSync('./commands/internal')
  .filter((file) => file.endsWith('.js'));
for (const file of internalCommandFiles) {
  const command = require(`./commands/internal/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.internalCommands.set(command.name, command);
}
const cooldowns = new Discord.Collection();

const validateMessage = require('./commands/functions/validateMessage');
const validateCooldown = require('./commands/functions/validateCooldown');

const {
  token, //
  prefix,
  iprefix,
  allowInternal,
  botChannelID,
  musicChannelID,
  generalChatID,
  guildID,
  volume
} = require('./config.json');

var musicQueue = {
  textChannel: null, // Instantiated once the client is ready and logged in
  voiceChannel: null,
  connection: null, // Associated to the voiceChannel above
  songs: [],
  volume: volume,
  playing: false,
  messageEmbed: {
    color: '#0A0A20'
  },
  musicPresence: {
    curDuration: '0:00',
    totalDuration: '0:00', // in seconds
    intervalObj: null,
    voiceTimeout: null
  }
};

// Basic event handlers --------------------------------------------------------------------------- Basic handlers
client.on('ready', () => {
  console.log('The bot is online!'); // logger.log('info', 'The bot is online!');
  client.user.setPresence({
    activity: {
      name: 'for commands',
      type: 'WATCHING'
    }
  });
  //setInterval(() => {console.log(`${client.ws.gateway} | ${client.ws.status} | ${client.ws.ping}`)}, 1000)
});
// client.on('debug', (m) => logger.log('debug', m));
// client.on('warn', (m) => logger.log('warn', m));
// client.on('error', (m) => logger.log('error', m));
// process.on('uncaughtException', (error) => logger.log('error', error));

// Message event handler -------------------------------------------------------------------------- Message handler
// This fires EVERY time a message is sent to the guild the bot is in (need to confirm the scope)
client.on('message', (message) => {
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  var _prefix = message.content.charAt(0);
  var command;
  // Message Validation -------------------------------------------------- Message Validation
  if (!validateMessage(message, musicQueue, _prefix, commandName, args)) return;
  message.suppressEmbeds(true);
  console.log(message.content + ' ');
  if (allowInternal && _prefix == iprefix) {
    command =
      client.internalCommands.get(commandName) ||
      client.internalCommands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
  } else {
    command =
      client.commands.get(commandName) ||
      client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
  }
  if (client.commands.get(commandName).tag === 'music') musicQueue.textChannel = message.channel;
  // Cooldown Validation ------------------------------------------------- Cooldown
  validateCooldown(command, message, cooldowns, Discord);
  // Execute command ----------------------------------------------------- Execution
  try {
    command.execute(message, args, musicQueue);
  } catch (error) {
    console.error(error);
    allowInternal && _prefix == iprefix
      ? message.reply('wtf you tryin to do here?')
      : message.send('<@160196595294535680>, Internal command failed!');
  }
});

client.login(token);
