module.exports = {
  name: 'resume',
  usage: '',
  requireVoice: true,
  tag: 'music',
  version: '1.0',
  description: 'Resumes the currently paused song',
  execute(message, args, musicQueue) {
    if (!musicQueue.songs[0]) return message.channel.send('Nothings playing retard');
    if (!musicQueue.connection.dispatcher.paused)
      return message.channel.send('Music is already playing');

    musicQueue.connection.dispatcher.resume();
    message.channel.send(`Resumed **${musicQueue.songs[0].title}**`);
    musicQueue.musicPresence.intervalObj = message.client.internalCommands
      .get('startSongPresence')
      .execute(message, musicQueue);
  }
};
