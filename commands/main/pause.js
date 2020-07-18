// Pauses the current song
module.exports = {
  name: 'pause',
  aliases: ['stop'],
  usage: '',
  requireVoice: true,
  tag: 'music',
  version: '1.0',
  description: 'Pauses the current song',
  execute(message, args, musicQueue) {
    if (!musicQueue.songs[0]) return message.channel.send('Nothings playing retard');
    if (musicQueue.connection.dispatcher.paused)
      return message.channel.send('Music is already paused');

    musicQueue.connection.dispatcher.pause();
    message.channel.send(`Paused **${musicQueue.songs[0].title}**`);

    // Execute internal command pauseSongPresence
    try {
      message.client.internalCommands
        .get('pauseSongPresence')
        .execute(message, musicQueue);
    } catch (error) {
      console.error(error);
      message.reply('Internal command failed! `pauseSongPresence()`');
    }
  }
};
