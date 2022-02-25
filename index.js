const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

const prefix = "/";

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    message.reply(message.content.slice(prefix.length).toLowerCase());
});

channel.messages.fetch({ limit: 10 })
  .then(messages => console.log(`Received ${messages.size} messages`))
  .catch(console.error);

client.login(config.BOT_TOKEN);
