// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

// Requires - Packages
const { Client } = require('discord.js');

class StarBoardClient extends Client {
  constructor(options) {
    super(options);
  }

  get ping() {
    return this.ws.ping;
  }

  get pings() {
    return this.ws.shards.array()[0].pings;
  }
}

module.exports = StarBoardClient;
