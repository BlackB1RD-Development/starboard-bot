// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

// Requires - Packages
const { Collection } = require('discord.js');

class Category extends Collection {
  constructor(name, entries) {
    super(entries);
    this.name = name;
  }

  /**
   * Returns the category commands in a String value.
   * @returns {String}
   */
  commandsArray() {
    return [...this.values].join(', ');
  }

  /**
   * Returns the category commands.
   * @returns {Array} 
   */
  commands() {
    return [...this.values];
  }

  /**
   * Returns name of category.
   * @returns {String} 
   */
  toString() {
    return this.name;
  }
}

module.exports = { Category };
