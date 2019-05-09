// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

// Requires - Packages
const { logger } = require('tools-kit');

// Assignments
const name = __filename.replace(__dirname, '').replace('.js', '').replace(/\\/g, '');

module.exports = {
  name,
  execute: (client, message, command, error) => {
    const errorMessage = `
    [COMMAND ERROR] ${this.name} [COMMAND ERROR]\n
    Server: ${message.guild.name} (ID: ${message.guild.id})\n
    Author: ${message.author.tag} (ID: ${message.author.id})\n\n
    Error: ${error.message}
    `;

    try {
      message.reply(`There were an error with the ${command.aliases[0]} command.\nPlease try again later...`);
      client.channels.get(errorsLogs).send(errorMessage);
    } catch (err) {

    } finally {
      logger.trace({ tag: 'COMMAND ERROR' }, error);
    }
  }
}
