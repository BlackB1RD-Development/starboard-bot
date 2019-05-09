// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

// Requires - Packages
const path = require('path');
const dotenv = require('dotenv');

// Requires - Files
const StarBoardClient = require('./lib/Client.js');

// Assignments
const client = new StarBoardClient();

// Settings dotenv variables
dotenv.config({ path: path.join(__dirname, 'src', '.env') });

// Loading commands & events
client.loadCommands(path.join(__dirname, 'src', 'commands'));
client.loadEvents(path.join(__dirname, 'src', 'events'));

// Login to Discord
client.login(process.env.TOKEN);
