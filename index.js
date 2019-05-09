// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

// Requires - Packages
const path = require('path');

// Requires - Files
const StarBoardClient = require('./lib/Client.js');
const { token } = require('./src/config.json');

// Assignments
const client = new StarBoardClient();

client.loadCommands(path.join(__dirname, 'commands'));
client.loadEvents(path.join(__dirname, 'events'));
client.login(token);
