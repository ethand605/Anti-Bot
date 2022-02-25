const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

const prefix = "/";
const searchedWord = "122d";

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    message.reply(message.content.slice(prefix.length).toLowerCase());

    let channel = message.channel;
    channel.messages.fetch({ limit: 100 })
        .then( (messages) => {
            let allMsg = [];
            messages.forEach( (msg) => {
                if (!msg.author.bot && msg.content.includes(searchedWord)){
                     allMsg.push(`${msg.author.username}: ${msg.content} [Jump](${msg.url})`); 
                }
            });
            console.log('Received Messages: \n'+ allMsg.join("\n"));
        })
        .catch(console.error);
});

// channelName = 
// const channel = new Discord.channel()

// channel.messages.fetch({ limit: 10 })
//   .then(messages => console.log(`Received ${messages.size} messages`))
//   .catch(console.error);

client.login(config.BOT_TOKEN);
