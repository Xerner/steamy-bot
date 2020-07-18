module.exports = {
  name: "reload",
  usage: `*command-name*`,
  args: true,
  version: '0.1',
  description: "Reloads a command",
  execute(message, args) {
    if (!args.length)
      return message.channel.send(
        `You didn't pass any command to reload, ${message.author}`
      );
    const commandName = args[0].toLowerCase();
    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command)
      return message.channel.send(
        `There is no command with name or alias \`${commandName}\`, ${message.author}`
      );
    
    // Require caches the loaded file, we want to reload that cached file
    delete require.cache[require.resolve(`./${command.name}.js`)];
    // Re-retrieve command file
    try {
      const newCommand = require(`./${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
      message.channel.send(`Command \`${command.name}\` was reloaded`);
    } catch (error) {
      console.log(error);
      message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
    }
  },
};
