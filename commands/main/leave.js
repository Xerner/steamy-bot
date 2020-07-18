module.exports = {
	name: 'leave',
	usage: '',
  version: '1.0',
	description: 'Makes the bot leave its voice channel',	
	execute(message, args, musicQueue) {
    if (message.guild.me.voiceChannel !== undefined) {
      message.guild.me.voiceChannel.leave();
      message.reply("I have successfully left the voice channel!");
    } else {
      message.reply("I'm not connected to a voice channel!");
    }
	}
};
