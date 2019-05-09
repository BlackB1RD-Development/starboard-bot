// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

// Requires - Packages
const path = require('path');

// Requires - Files
const StarBoardClient = require('./lib/Client.js');
const env = require('dotenv');


env.config({
    path: path.join(__dirname, "src", ".env")
});

// Assignments
const client = new StarBoardClient();

client.loadCommands(path.join(__dirname, 'src', 'commands'));
client.loadEvents(path.join(__dirname, 'src', 'events'));
client.login(process.env.TOKEN);
