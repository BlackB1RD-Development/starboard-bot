// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

// Requires - Files
const StarBoardClient = require('./lib/Client.js');
const config = require('./src/config.json');

// Assignments
const client = new StarBoardClient();

client.login(config.token);
