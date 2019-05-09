// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

// Requires - Packages
const { logger } = require('tools-kit');

// Requires - Files
const { version } = require('../config.json');

// Assignments
const name = __filename.replace(__dirname, '').replace('.js', '').replace(/\\/g, '');

module.exports = {
  name,
  execute: (client) => {
    client.user.setActivity(`StarBoard Bot v${version}`);
    logger.success(`Ready!\nServing ${client.users.size} users in ${client.guilds.size} guilds.`);
  }
};
