const { Client } = require('discord.js');
const config = require('../config/config.json');

class StarBoardClient extends Client {
  constructor(options) {
    super(options);
  }

  ping() {
    return this.ws.ping;
  }

  pings() {
    return this.ws.shards.array()[0].pings;
  }
}

let client = new StarBoardClient();
client.login(config['token']);
