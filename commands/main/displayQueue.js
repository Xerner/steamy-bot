const Discord = require('discord.js');
// Adds a song to the bots music queue
// Currently needs to be a URL

// Named 'play' but its main functionality is to queue a song, then automatically plays it
// It is named play because thats what people will use to play songs
module.exports = {
  name: 'queue',
  requireVoice: true,
  tag: 'music',
  description: 'Plays a song from Youtube using its URL',
  version: '1.0',
  execute(message, args, musicQueue) {
    // Displays musicQueue's current song array
    const embed = new Discord.MessageEmbed();
    embed.setColor(musicQueue.messageEmbed.color).setTitle('Queue');
    musicQueue.songs.forEach((song) =>
      embed.addFields({ name: `${song.title}`, value: `Length: ${song.totalDuration}]` })
    );
    message.embed(embed);
  }
};
