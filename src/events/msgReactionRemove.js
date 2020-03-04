// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'messageReactionRemove',
  execute: async (client, reaction, user) => {
    if (!reaction.message.guild) return;
    if (reaction.emoji.name === '⭐') {
      if (message.partial) await reaction.message.fetch();
      const post = client.provider.findOne(reaction.message.id);

      if (!post) return;

      // Updating
      const channel = client.channels.get(process.env.CHANNEL);
      if (!channel) throw new Error('Client Found no default channel for starboard, please add one!');

      const og = channel.messages.get(post.starMessage);
      if (!og) {
        // Deleted Message
        client.provider.deleteOne(post.starMessage);
        return;
      }
      
      const emb = new MessageEmbed()
        .addField('Author', user.toString(), true)
        .addField('Channel', client.channels.get(post.channel).toString(), true)
        // eslint-disable-next-line quotes
        .addField('Jump', `Click [here](https://discordapp.com/channels/${process.env.GUILD}/${post.channel}/${post.message}) to jump to message in question.`)
        .setFooter(`Stars: ${post.stars - 1} ⭐`)
        .setColor('e4ed38');

      if (post.content && post.content.length > 0) emb.addField('Content', post.content.slice(0, 1999), true);
      if (post.links && post.links.length > 0) emb.addField('Links', post.links, true);
      if (post.image || (post.links && post.links.length > 0)) emb.setImage(post.image ? post.image : post.links.length > 0 ? post.links.split(', ')[0] : '');

      await og.edit(emb).catch(err => {
        throw new Error(err);
      });

      await client.provider.incrementOne(post.message, post.starMessage, -1);
    }
  }
};
