// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

// Requires - Files
const StarBoardClient = require('./lib/Client.js');
const config = require('./src/config.json');
const path = require('path');

// Assignments
const client = new StarBoardClient();


client.loadEvents(path.join(__dirname, 'events'));
client.loadCommands(path.join(__dirname, 'commands'));


client.login(config.token);
