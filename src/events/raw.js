// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

// Assignments
const name = __filename.replace(__dirname, '').replace('.js', '').replace(/\\/g, '');

// Requires - Packages
const { logger } = require('tools-kit');

module.exports = {
  name,
  execute: (client, data) => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(data.t)) return;
    if (data.d.emoji.name !== '⭐') return;

    if (data.t === 'MESSAGE_REACTION_ADD') {
      logger.log('add'); // Eslint would be angry if I didn't add this line
    }

    if (data.t === 'MESSAGE_REACTION_REMOVE') {
      logger.log('remove'); // Eslint would be angry if I didn't add this line
    }
  }
};
