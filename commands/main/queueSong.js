const Discord = require('discord.js');
const ytdl = require('ytdl-core');

// Named 'play' but its main functionality is to queue a song, then automatically plays it
// It is named play because thats what people will use to play songs
module.exports = {
  name: 'play',
  usage: '*youtube-url*',
  requireVoice: true,
  tag: 'music',
  version: '1.0',
  description: 'Plays a song from Youtube using its URL',
  async execute(message, args, musicQueue) {
    // Variable declarations
    const voiceChannel = message.member.voice.channel;
    const permissions = voiceChannel.permissionsFor(message.client.user);    
    var song;
    musicQueue.voiceChannel = voiceChannel;

    // Removes youtube embedded thumbnail, just to tidy things up
    message.suppressEmbeds(true);

    // Check permissions
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
      return message.channel.send(
        'I need the permissions to join and speak in your voice channel!'
      );

    // Get song info
    song = await getSongInfo(args[0]);
    
    // Attempt to join voice
    musicQueue.connection = await connectToVoice(voiceChannel);

    // Song added to queue message
    musicQueue.songs.push(song);
    sendEmbed(message, song, musicQueue.messageEmbed.color);

    // Play song immediately if the queue contains only 1 song
    if (musicQueue.songs.length === 1)
      return message.client.internalCommands.get('playSong').execute(message, args, musicQueue);
  }
};

async function getSongInfo(url) {
  // Download song info
  var debugTime;
  var d;
  d = new Date();
  debugTime = d.getTime();

  const songInfo = await ytdl.getInfo(url);
  console.log(`${debugTime = d.getTime() - debugTime} seconds to download song info`);

  // Save song info into an object
  const song = {
    title: songInfo.title,
    duration: '0:00',
    totalDuration: sToTime(songInfo.length_seconds),
    url: songInfo.video_url,
    likes: songInfo.likes,
    dislikes: songInfo.dislikes
  };
  return song;
}

async function connectToVoice(voiceChannel) {
  var connection;
  try {
    connection = await voiceChannel.join(); // Attempts to join the voice chat
  } catch (err) {
    console.log(`*Failed to join voice channel!*  Channel Name: ${voiceChannel.name}`);
    message.channel.send(`*Failed to join voice channel!*  Channel Name: ${voiceChannel.name}`);
  }

  // Setup some event handlers
  // connection.on('disconnect', () => {
  //   console.log('Disconnecting from voice');
  // });
  connection.on('error', (error) => {
    console.log(`Voice connection error | ${error.message}`);
  });
  return connection;
}

function sendEmbed(message, song, color) {
  message.channel.send(
    new Discord.MessageEmbed()
      .setColor(color)
      .setTitle('Added to Queue')
      .setURL(song.url)
      .setDescription(`**${song.title} **`)
      .addFields({
        name: `[${song.duration}/${song.totalDuration}]`,
        value: `Likes: ${song.likes} | Dislikes: ${song.dislikes}`,
        inline: true
      })
  );
}

function sToTime(s) {
  var secs = s % 60;
  s = s - secs;
  var mins = s / 60;

  mins = Math.floor(mins);
  secs = Math.floor(secs);
  if (secs < 10) secs = '0' + secs;

  return mins + ':' + secs; // + '.' + ms;
}
