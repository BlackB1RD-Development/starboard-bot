// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

// Requires - Packages
const path = require('path');


// Assignments
const category = __dirname.split(path.sep).pop().charAt(0).toUpperCase() + __dirname.split(path.sep).pop().slice(1).toString().trim();
const name = __filename.replace(__dirname, '').replace('.js', '').replace(/\\/g, '');

module.exports = {
  usage: process.env.PREFIX + name,
  example: process.env.PREFIX + name,
  aliases: [name],
  category,
  execute: (client, message) => {
    message.channel.send('Pinging...')
      .then(m => {
        m.edit(`Pong!\nLatency is: ${m.createdTimestamp - message.createdTimestamp}ms.\nAPI latency is: ${Math.round(client.ping)}ms`);
      })
      .catch(error => this.error(client, message, error));
  }
};
