// StarBoard-BOT By BlackB1RD-Development. All rights reserved ©
// Project: https://github.com/BlackB1RD-Development/starboard-bot
// License: MIT

const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'messageReactionAdd',
  execute: async (client, reaction, user) => {
    if (!reaction.message.guild) return;
    if (reaction.emoji.name === '⭐') {
      if (reaction.message.partial) await reaction.message.fetch();
      const post = client.provider.findOne(reaction.message.id);

      if (!post) {
        // new post
        const channel = client.channels.get(process.env.CHANNEL);
        if (!channel) throw new Error('Client Found no default channel for starboard, please add one!');

        // Empty message?
        if ((!reaction.message.content || reaction.message.content.length < 1) && !reaction.message.attachments.first()) return;

        const msg = reaction.message;
        const parsedLinks = msg.content.match(/^https?:\/\/(\w+\.)?imgur.com\/(\w*\d\w*)+(\.[a-zA-Z]{3})?$/);
        const attachments = msg.attachments && msg.attachments.first() ? msg.attachments.first() : undefined;
        if (parsedLinks && parsedLinks.length > 0) {
          // Removing links
          msg.content.replace(/^https?:\/\/(\w+\.)?imgur.com\/(\w*\d\w*)+(\.[a-zA-Z]{3})?$/, '');
        }

        const emb = new MessageEmbed()
          .addField('Author', user.toString(), true)
          .addField('Channel', reaction.message.channel.toString(), true)
          // eslint-disable-next-line quotes
          .addField('Jump', `Click [here](https://discordapp.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}) to jump to message in question.`)
          .setFooter('Stars: 1 ⭐')
          .setColor('e4ed38');
        if (msg.content.length > 0) emb.addField('Content', msg.content.slice(0, 1999), true);
        if (parsedLinks) emb.addField('Links', parsedLinks.join('\n'), true);
        if (attachments || (parsedLinks && parsedLinks.length > 0)) emb.setImage(attachments ? attachments.url : parsedLinks.length > 0 ? parsedLinks[0] : '');

        const ogMessage = await channel.send(emb).catch(err => {
          throw new Error(err);
        });

        await client.provider.createOne({
          user: msg.author.id,
          channel: msg.channel.id,
          message: msg.id,
          starMessage: ogMessage.id,
          content: msg.content,
          links: parsedLinks && parsedLinks.length > 0 ? parsedLinks.join(', ') : undefined,
          image: attachments ? attachments.url : undefined
        });
        return;
      } else {
        // Updating
        const channel = client.channels.get(process.env.CHANNEL);
        if (!channel) throw new Error('Client Found no default channel for starboard, please add one!');

        const og = channel.messages.get(post.starMessage);
        if (!og) {
          // Deleted message
          client.provider.delete(post.starMessage);
          return;
        }

        const emb = new MessageEmbed()
          .addField('Author', client.users.get(post.user).toString(), true)
          .addField('Channel', client.channels.get(post.channel).toString(), true)
          // eslint-disable-next-line quotes
          .addField('Jump', `Click [here](https://discordapp.com/channels/${process.env.GUILD}/${post.channel}/${post.message}) to jump to message in question.`)
          .setFooter(`Stars: ${post.stars + 1} ⭐`)
          .setColor('e4ed38');

        if (post.content && post.content.length > 0) emb.addField('Content', post.content.slice(0, 1999), true);
        if (post.links && post.links.length > 0) emb.addField('Links', post.links, true);
        if (post.image || (post.links && post.links.length > 0)) emb.setImage(post.image ? post.image : post.links.length > 0 ? post.links.split(', ')[0] : '');

        await og.edit(emb).catch(err => {
          throw new Error(err);
        });

        await client.provider.incrementOne(post.message, post.starMessage, 1);
      }
    }
  }
};
