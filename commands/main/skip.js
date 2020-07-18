// Skips the current song
// Relies on the internal command 'play' to set the bots presence to normal
module.exports = {
  name: 'skip',
  usage: '',
  requireVoice: true,
  tag: 'music',
  version: '1.0',
  description: 'Skips the current song',
  execute(message, args, musicQueue) {
    if (!musicQueue.songs[0]) return message.channel.send('Nothings playing retard');
    message.channel.send(`Skipped **${musicQueue.songs[0].title}**`);       
    musicQueue.connection.dispatcher.end();
  }
};
