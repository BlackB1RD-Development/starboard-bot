// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

// eslint-disable-next-line no-unused-vars
const { Client } = require('discord.js');

class SQLiteProvider {
  // LINKS FOR TYPES

  /**
   * @external SQLiteDatabase
   * @see {@link https://www.npmjs.com/package/better-sqlite3}
   */

  /**
   * @external SQLiteStatement
   * @see {@link https://www.npmjs.com/package/sqlite}
   */

  /**
   * @typedef {Object} SqliteOptions
   * @property {number} [maxAge] - Time to store in cache, default is 300000 ms or (5 minutes) must provide in ms! if you do -1 then it will never delete from cache!
   */

  // END

  /**
   * @param {Client} client - Discord client
   * @param {SQLiteDatabase} db - Database for the provider
   * @param {Object} settings - Default settings for provider
   * @param {number} [settings.maxAge] - Time to store in cache, default is 300000 ms or (5 minutes) must provide in ms! if you do -1 then it will never delete from cache!
   */
  constructor(client, db, settings) {
    /**
     * Discord client
     * @type {Client}
     */
    this.client = client;

    /**
     * @type {SQLiteProvider}
     */
    this.db = db;

    /**
     * @type {SQLiteStatement}
     * @private
     */
    this.post = null;

    /**
     * @type {SQLiteStatement}
     * @private
     */
    this.delete = null;

    /**
     * @type {SQLiteStatement}
     * @private
     */
    this.find = null;

    /**
     * @type {SQLiteStatement}
     * @private
     */
    this.findByID = null;

    /**
     * @type {SQLiteStatement}
     * @private
     */
    this.update = null;

    /**
     * @type {SQLiteStatement}
     * @private
     */
    this.fetchAll = null;

    /**
     * Saves queries in cache for some period of time.
     * @type {Map<string, Object>}
     */
    this.cache = new Map();

    if (!settings) settings = {};

    /**
     * @type {SqliteOptions}
     */
    this.settings = settings;

    if (!settings.maxAge || typeof settings.maxAge !== 'number') this.settings.maxAge = 300000;
  }

  async _init() {
    await this.db
      .prepare(
        'CREATE TABLE IF NOT EXISTS posts (_id INTEGER PRIMARY KEY AUTOINCREMENT, user VARCHAR(500), channel VARCHAR(500) NOT NULL, message VARCHAR(500) NOT NULL, starMessage VARCHAR(500) NOT NULL, content TEXT, links TEXT, image TEXT, stars INTEGER, createdAt TEXT)'
      )
      .run();

    await this.db.prepare('CREATE INDEX IF NOT EXISTS idx_posts on posts(_id, starMessage)').run();
    await this.db.prepare('CREATE INDEX IF NOT EXISTS idx_message on posts(message)').run();

    const statements = await Promise.all([
      this.db.prepare('SELECT * FROM posts WHERE _id = ?'),
      this.db.prepare('SELECT * FROM posts WHERE message = ?'),
      this.db.prepare('DELETE FROM posts WHERE starMessage = ?'),
      this.db.prepare(
        'INSERT INTO posts (user, channel, message, starMessage, content, links, image, stars, createdAt) VALUES (@user, @channel, @message, @starMessage, @content, @links, @image, @stars, @createdAt)'
      ),
      this.db.prepare('UPDATE posts SET stars = stars + ? WHERE starMessage = ?'),
      this.db.prepare('SELECT starMessage FROM posts')
    ]);

    // Defining statements
    this.findByID = statements[0];
    this.find = statements[1];
    this.delete = statements[2];
    this.post = statements[3];
    this.update = statements[4];
    this.fetchAll = statements[5];

    // Caching!
    const posts = this.fetchAll.all();
    for (let post of posts) {
      const guild = this.client.guilds.get(process.env.GUILD);
      if (typeof guild === 'undefined') throw new Error('SQLiteProvider: invalid guild in config!');
      const channel = guild.channels.get(process.env.CHANNEL);
      if (typeof channel === 'undefined' || channel.type !== 'text') throw new Error('SQLiteProvider: invalid channel in config!');
      // Storing messages in cache
      await channel.messages.fetch(post);
    }
  }

  /**
   *
   * @param {string} id - id
   * THIS DOES NOT CACHE!
   */
  findOneById(id) {
    if (typeof id !== 'string') throw new Error('SQLiteProvider: ID must be a string!');
    return this.findByID.get(id);
  }

  /**
   *
   * @param {string} messageId - id of a message
   */
  findOne(messageId) {
    if (typeof messageId !== 'string') throw new Error('SQLiteProvider: messageId must be a string!');
    const cache = this.cache.get(messageId);
    if (cache) return cache;
    const post = this.find.get(messageId);
    if (post) {
      this.cache.set(
        messageId,
        Object.assign(
          {
            delete: setTimeout(() => {
              this.cache.delete(messageId);
            }, this.settings.maxAge)
          },
          post
        )
      );
    }
    return post;
  }

  /**
   * @param {string} messageId
   * @param {string} starMessageId - id of a star message
   * @param {number} [amount] - amount to increment stars by. Default is 1
   */
  incrementOne(messageId, starMessageId, amount = 1) {
    if (typeof messageId !== 'string') throw new Error('SQLiteProvider: messageId must be a string!');
    if (typeof starMessageId !== 'string') throw new Error('SQLiteProvider: starMessageId must be a string!');
    if (typeof amount === 'undefined') throw new Error('SQLiteProvider: amount must be a number!');
    const isCached = this.cache.get(messageId);
    if (isCached) {
      isCached.stars += amount;
    }
    this.update.run(amount, starMessageId);
  }

  /**
   *
   * @param {Object} values
   * @param {string} values.user - User ID!
   * @param {string} values.channel - channel ID!
   * @param {string} values.message - message ID that was given a reaction!
   * @param {string} values.starMessage - message ID of message that was posted in channel specified in config
   * @param {string|undefined} [values.content] - content of this values.message can be null
   * @param {string|undefined} [values.links] - links separated by ","
   * @param {string|undefined} [values.image] - Link of attachment from a values.message or it will use values.links[0] if there is one otherwise it won't show image
   * @param {number|undefined} [values.stars] - amount of stars to create this post with default is "1"
   *
   */
  createOne(values) {
    // Required properties check.
    if (typeof values.user !== 'string') throw new Error('SQLiteProvider: values.user must be a string!');
    if (typeof values.channel !== 'string') throw new Error('SQLiteProvider: values.channel must be a string!');
    if (typeof values.message !== 'string') throw new Error('SQLiteProvider: values.message must be a string!');
    if (typeof values.starMessage !== 'string') throw new Error('SQLiteProvider: values.starMessage must be a string!');

    // Semi-Required/Default handler.
    if (typeof values.content === 'undefined' && typeof values.links === 'undefined' && typeof values.image === 'undefined')
      throw new Error('SQLiteProvider: You can\'t create a post with no links, image and content you must at least have one of them!');
    if (!values.stars || typeof values.stars !== 'number') values.stars = 1;

    this.post.run(Object.assign({ createdAt: Date.now() }, values));
  }

  /**
   *
   * @param {string} _id - id of a post to delete
   */
  deleteOne(_id) {
    if (typeof _id !== 'string') return new Error('SQLiteProvider: _id must be a string!');
    this.delete.run(_id);
  }
}

module.exports = SQLiteProvider;
