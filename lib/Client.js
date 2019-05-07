// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

// Requires - Packages
const { Client, Collection } = require('discord.js');
const { readdirSync, statSync } = require('fs');
const { Category } = require('./Util/Category');
const path = require('path');

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

    this.on('message', msg => this.handleMessage(msg));
  }

  handleMessage(msg) {
    let prefix = '!';
    let args = msg.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    let command = args.shift().toLowerCase();
    let cmd = this.commands.get(command);
    if (cmd) {
      try {
        cmd.run(this, msg, args);
      } catch (err) {/*Error to handle..*/}
    }
  }

  /**
	 * Returns average ping
	 * @returns {number}
	 */
  get ping() {
    return this.ws.ping;
  }

  /**
	 *
	 * @param {string} directory - location of commands
	 * @returns {void}
	 */
  loadCommands(directory) {
    let files = readdirSync(directory);
    for (let file of files) {
      if (statSync(path.join(directory, file)).isDirectory()) {
        this.loadCommands(path.join(directory, file));
      } else {
        let command = require(path.join(directory, file));
        this._registerCommand(command);
      }
    }
  }

  /**
	 *
	 * @param {string} directory - location of events
	 * @returns {void}
	 */
  loadEvents(directory) {
    let files = readdirSync(directory);
    for (let file of files) {
      if (statSync(path.join(directory, file)).isDirectory()) {
        this.loadEvents(path.join(directory, file));
      } else {
        let command = require(path.join(directory, file));
        this._registerEvent(command);
      }
    }
  }

  /**
	 * Register a event
	 * @param {Object} event - event obj
	 * @private
	 * @returns {void}
	 */
  _registerEvent(event) {
    if (typeof event !== 'object') return;
    if (this.events.get(event.name))
      return new Error('EVENT_REGISTRY: Event already registered.');
    this.events.set(event.name);
    this.on(event.name, (...args) => event.run(this, args));
  }

  /**
	 * @private
	 * @param {Object} command - command
	 * @returns {void}
	 */
  _registerCommand(command) {
    if (typeof command !== 'object') return;
    if (this.commands.get(command.aliases[0]))
      return new Error('COMMAND_REGISTRY: Command already registered');
    if (!this.categories.get(command.category)) {
      this.categories.set(command.categories, new Category(command.category));
    }
    const category = this.categories.get(command.category);
    category.set(command.name, command);
    this.commands.set(command.aliases[0], command);
  }

  /**
	 * Returns last 3 heartbeats
	 * @returns {number[]}
	 */
  get pings() {
    return this.ws.shards.array()[0].pings;
  }
}

module.exports = StarBoardClient;
