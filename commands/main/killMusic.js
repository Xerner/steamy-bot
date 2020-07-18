module.exports = {
  name: 'kill',
  aliases: ['end'],
  tag: 'music',
  description: 'Ends music stream',
  requireVoice: true,
  version: '1.0',
  execute() {
    musicQueue.songs = [];
    musicQueue.connection.dispatcher.end();
    message.channel.send(`**Music queue emptied**`);
  }
};
