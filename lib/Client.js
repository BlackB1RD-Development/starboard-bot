// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

// Requires - Packages
const path = require('path');
const { readdirSync, statSync } = require('fs');
const { Client, Collection } = require('discord.js');

// Requires - Files
const { Category } = require('./Util/Category.js');
const { prefix } = require('../src/config.json');

class StarBoardClient extends Client {
  constructor(options) {
    super(options);

    /**
		 * @type {Collection<string, Object>}
		 */
    this.commands = new Collection();

    /**
		 * @type {Collection<string, Object>}
		 */
    this.events = new Collection();

    /**
		 * @type {Collection<string, Category>}
		 */
    this.categories = new Collection();

    this.on('message', message => this.handleMessage(message));
  }

  /**
   * Handle a message
   * @param {Object} message The message object to handle
   */
  handleMessage(message) {
    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    const command = args.shift().toLowerCase();
    const cmd = this.commands.get(command);

    if (cmd) {
      try {
        cmd.execute(this, message, args);
      } catch (error) {
        this.emit('cmdError', message, cmd, error);
      }
    }
  }

  /**
	 * Load commands from directory
	 * @param {string} directory Commands directory
	 * @returns {void}
	 */
  loadCommands(directory) {
    const files = readdirSync(directory);

    for (const file of files) {
      if (statSync(path.join(directory, file)).isDirectory()) this.loadCommands(path.join(directory, file));
      else {
        const command = require(path.join(directory, file));

        this._registerCommand(command);
      }
    }
  }

  /**
	 * Load events from directory
	 * @param {string} directory Events directory
	 * @returns {void}
	 */
  loadEvents(directory) {
    const files = readdirSync(directory);

    for (const file of files) {
      if (statSync(path.join(directory, file)).isDirectory()) this.loadEvents(path.join(directory, file));
      else {
        const event = require(path.join(directory, file));

        this._registerEvent(event);
      }
    }
  }

  /**
	 * @private
	 * @param {Object} command - command obj
	 * @returns {void}
	 */
  _registerCommand(command) {
    if (typeof command !== 'object') return;
    else if (this.commands.get(command.name)) return new Error('COMMAND_REGISTRY: Command already registered');
    else if (!this.categories.get(command.category)) this.categories.set(command.category, new Category(command.category));

    const category = this.categories.get(command.category);

    category.set(command.name, command);
    this.commands.set(command.aliases[0], command);
  }

  /**
	 * @private
	 * @param {Object} event - event obj
	 * @returns {void}
	 */
  _registerEvent(event) {
    if (typeof event !== 'object') return;
    else if (this.events.get(event.name)) return new Error('EVENT_REGISTRY: Event already registered.');

    this.events.set(event.name);
    this.on(event.name, (...args) => event.execute(this, ...args));
  }

  /**
	 * Returns average ping
	 * @returns {number}
	 */
  get ping() {
    return this.ws.ping;
  }
}

module.exports = StarBoardClient;
