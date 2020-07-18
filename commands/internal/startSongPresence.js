const intervalms = 5000;

module.exports = {
  name: 'startSongPresence',
  usage: '*message* *musicQueue*',
  args: true,
  version: '1.0',
  description: 'Internal command - Changes the bots presence to the currently playing song',
  execute(message, musicQueue) {
    // Retrieve the songs current duration and initialize the bots presence
    getSongTimes(musicQueue);
    message.client.internalCommands
      .get('setPresence')
      .execute(
        message,
        'PLAYING',
        `▶️ [${musicQueue.songs[0].curDuration}/${musicQueue.musicPresence.totalDuration}] ${musicQueue.songs[0].title}`
      );
    // Start a timeout interval to update the bots presence every so often with the current position in the song
    musicQueue.musicPresence.intervalObj = startTimeoutInterval(message, musicQueue);
  }
};

function getSongTimes(musicQueue) {
  musicQueue.songs[0].curDuration = msToTime(musicQueue.connection.dispatcher.streamTime / 1000);
  musicQueue.musicPresence.totalDuration = musicQueue.songs[0].totalDuration;
}

function startTimeoutInterval(message, musicQueue) {
  return setInterval(() => {
    try {
      musicQueue.songs[0].curDuration = msToTime(
        musicQueue.connection.dispatcher.streamTime / 1000
      );
      message.client.internalCommands
        .get('setPresence')
        .execute(
          message,
          'PLAYING',
          `▶️ [${musicQueue.songs[0].curDuration}/${musicQueue.musicPresence.totalDuration}] ${musicQueue.songs[0].title}`
        );
    } catch (error) {
      console.log(error);
    }
  }, intervalms);
}

function msToTime(ms) {
  var secs = ms % 60;
  ms = (ms - secs) / 60;
  var mins = ms % 60;

  mins = Math.floor(mins);
  secs = Math.floor(secs);
  if (secs < 10) secs = '0' + secs;

  return mins + ':' + secs;
}
