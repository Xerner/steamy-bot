module.exports = {
  name: 'join',
  usage: '',
  version: '1.0',
  description: 'Join a voice channel',
  execute(message) {
    try {
      message.author.voice.channel
        .join()
        .then(() => console.log(`Joined chat ${message.author.voice.channel.name}`));
    } catch {
      message.author.voice.channel.send('Failed to join voice!');
    }
  }
};
