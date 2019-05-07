module.exports = {
  aliases: ['ping'],
  run: (client, msg) => {
    msg.reply(`Pong!: \`${client.ping}\``);
  }
};