module.exports = {
  name: 'pauseSongPresence',
  usage: '*message* *musicQueue*',
  args: true,
  version: '1.0',
  description:
    'Internal command - Sets the bots music presence to its paused state and clears the timeout interval',
  execute(message, musicQueue) {
    clearInterval(musicQueue.musicPresence.intervalObj);
    musicQueue.musicPresence.intervalObj = null;
    message.client.internalCommands
      .get('setPresence')
      .execute(
        message,
        'PLAYING',
        `⏸️ [${musicQueue.songs[0].curDuration}/${musicQueue.musicPresence.totalDuration}] ${musicQueue.songs[0].title}`
      );
  }
};
