module.exports = {
  name: 'setPresence',
  usage: '*message* *type* *info*',
  args: true,
  version: '1.0',
  description: 'Internal command - Sets the bots presence',
  execute(message, type, info) {
    message.client.user.setPresence({
      activity: {
        name: info,
        type: type
      }
    });
  }
};