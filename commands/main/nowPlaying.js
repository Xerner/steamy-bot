const Discord = require('discord.js');

// Displays information about a song. default song is index 0
module.exports = {
  name: 'np',
  aliases: ['song'],
  requireVoice: true,
  tag: 'music',
  description: 'Displays information about the currently playing song',
  version: '1.0',
  execute(message, args, musicQueue) {
    const song = musicQueue.songs[0];
    if (!musicQueue.songs[0]) return message.channel.send('Nothings playing retard');

    message.embed(
      new Discord.MessageEmbed()
        .setColor('#0A0A20')
        .setTitle('Now Playing')
        .setURL(song.url)
        .setDescription(`**${song.title} **`)
        .addFields({
          name: `[${song.duration}/${song.totalDuration}]`,
          value: `Likes: ${song.likes} | Dislikes: ${song.dislikes}`,
          inline: true
        })
    );
  }
};
