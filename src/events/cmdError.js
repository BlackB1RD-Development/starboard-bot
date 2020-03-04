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
    const errorMessage = `[COMMAND ERROR] ${command.aliases[0].toUpperCase()} [COMMAND ERROR]` +
    `\n\nServer: ${message.guild.name} (ID: ${message.guild.id})` +
    `\nAuthor: ${message.author.tag} (ID: ${message.author.id})` +
    `\n\nError: ${error.message}`;

    try {
      message.reply(`There were an error with the ${command.aliases[0]} command.\nPlease try again later...`);
      client.channels.cache.get(process.env.ERRORS_CHANNEL).send(errorMessage);
    } finally {
      logger.trace({ tag: 'COMMAND ERROR' }, error);
    }
  }
};
