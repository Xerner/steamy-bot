// Displays a users avatar in chat
module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp'],
  usage: '',
  version: '1.0',
  description: 'Returns a users avatar picture',
  execute(message) {
    if (!message.mentions.users.size) {
      message.channel.send(`<${message.author.displayAvatarURL({ format: 'png', dynamic: true })}>`);
    }
  },
};
