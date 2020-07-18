const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');

const songFileName = 'temp_songfile.webm';

// I plan on making this non-recursive one day
module.exports = {
  name: 'playSong',
  usage: '*youtube-url*',
  args: true,
  version: '1.0',
  description:
    "Internal command - Checks if there's any songs in the queue, and plays them through a streamDispatcher",
  async execute(message, args, musicQueue) {
    const song = musicQueue.songs[0];
    console.log(`Music Queue length: ${musicQueue.songs.length}`)
    if (musicQueue.songs.length === 0) {
      // musicQueue.musicPresence.voiceTimeout = message.client.setTimeout(
      //   musicQueue.voiceChannel.leave(),
      //   60000
      // );
      // // musicQueue.voiceChannel.leave(),
      message.client.internalCommands.get('killSongPresence').execute(message, musicQueue);
    } else {
      // Plays the song, AND sets an event listener for when the song finishes to move onto the next song
      await play(message, args, musicQueue, song);

      message.client.internalCommands.get('startSongPresence').execute(message, musicQueue);

      // Message channel that a song is now playing
      sendEmbed(musicQueue, musicQueue.songs[0], musicQueue.messageEmbed.color);
    }
  }
};

// Thanks to @amalbansode
// This is a work-around to the ytdl stream firing the 'end' event too early
// https://github.com/discordjs/discord.js/issues/3362
async function play(message, args, musicQueue, song) {
  // Essentially, I am writing the online audio stream into a local file,
  // which, in this case is called file.webm
  let writeStream = await ytdl(song.url).pipe(fs.createWriteStream(songFileName, { flags: 'w' }));

  // Adding a small delay here so that a potentially slow write process above
  // won't hamper the reading process in the next steps
  await new Promise((done) => setTimeout(done, 5000));

  // Reading the same file after a delay of 5000ms as. The object is a node stream.
  let readStream = fs.createReadStream(songFileName);

  // Created a StreamDispatcher playing the read stream created above
  const dispatcher = musicQueue.connection
    .play(readStream, { volume: musicQueue.volume, bitrate: 'auto', plp: 0, fec: true })
    .on('end', () => {
      console.log('Stream ended!');
      writeStream.end();
    })
    .on('finish', async () => {
      console.log('Stream ended!');
      if (musicQueue.songs.length > 0) musicQueue.songs.shift();
      await message.client.internalCommands.get('playSong').execute(message, args, musicQueue);
    })
    .on('error', (error) => {
      console.error(error);
    });
}

function sendEmbed(musicQueue, song, color) {
  musicQueue.textChannel.send(
    new Discord.MessageEmbed()
      .setColor(color)
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
