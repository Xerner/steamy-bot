// This module was taken from https://discordjs.guide/command-handling/adding-features.html#cooldowns
// ------------------------------------------------------------------------------------------------
"use strict";
const defaultCooldown = 3;

// Commands cooldown handling
function validateCooldown(command, message, cooldowns, Discord) {
  // if there is no cooldown map for the command found, then make one
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name); // timestamps = collection of { key: @author_id, cooldownRemaining }
  const cooldownAmount = (command.cooldown || defaultCooldown) * 1000; // milliseconds * 1000 = seconds

  if (timestamps.has(message.author.id)) { // Checks if theres a cooldown for that user
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount; // remember that cooldownRemaining is a date-value

    if (now < expirationTime) { // true if still cooling down
      const timeLeft = (expirationTime - now) / 1000; // timeLeft is in seconds
      message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
      return false;
    }
  } // No else because if there is a cooldown, then the cooldown could still be expired anyways
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  console.log('cooldown successfully validated!');
  return true;
}

module.exports = validateCooldown;
