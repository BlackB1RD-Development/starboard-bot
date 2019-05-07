const { Collection } = require('discord.js');

class Category extends Collection {
  constructor(name, entries) {
    super(entries);
    this.name = name;
  }


  /**
   * 
   */
  commandsArray() {
    return [...this.values].join(', ');
  }

  /**
   * 
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
