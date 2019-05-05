const { Client } = require('discord.js'); 
const { token, prefix } = require('../config/config.json');

class StarBoardClient extends Client {
  constructor(options) {
    super(options);
  }

  ping() {
    return this.ws.ping;
  }

  pings() {
    return this.ws.shards.array()[0].pings;
  }
}

let client = new StarBoardClient();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (var file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(util.config.prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.guildOnly == true && message.channel.type === 'dm') {
    return message.channel.send('I can\'t execute that command inside DMs!');
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  var cooldownAmount = (command.cooldown) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.channel.send(`Please wait ${timeLeft.toFixed(2)} more second(s) before using the command \`${command.name}\` again.`);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(client, message, args);
  } catch (err) {
    console.log(err)
  }
});

client.once('ready', () => {
  client.user.setActivity(`${prefix}help`, {
    type: 'LISTENING'
  })
})

client.login(config['token']);
