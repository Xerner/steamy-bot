module.exports = {
  name: 'ping',
  usage: '',
  version: '1.0',
  description: 'Ping!',
  execute(message) {
    message.channel.send('Pong.');
  }
};
