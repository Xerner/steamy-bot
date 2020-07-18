const { SystemChannelFlags } = require('discord.js');

module.exports = {
  name: 'killSongPresence',
  usage: '*message* *musicQueue*',
  args: true,
  version: '1.0',
  description:
    'Internal command - Resets the bots presence to its default and clears the timeout interval',
  execute(message, musicQueue) {
    try {
      clearInterval(musicQueue.musicPresence.intervalObj);
      musicQueue.musicPresence.intervalObj = null;
      message.client.internalCommands
        .get('setPresence')
        .execute(message, 'WATCHING', 'for commands');
    } catch (error) {
      console.log(error);
    }
  }
};
