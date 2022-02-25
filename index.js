const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

const prefix = "/";
const searchedWord = "122d";
const excludedWords = ["role", "/"];

let exclusionCheck = (msg) => {
    found = false;
    excludedWords.forEach((word) => {
        if (msg.includes(word)) { found = true;}
    })
    return !found;
}

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    let channel = message.channel;

    

    // message.reply(message.content.slice(prefix.length).toLowerCase());

    // let channel = message.channel;
    let allMsg = [];
    channel.messages.fetch({ limit: 100 })
        .then( (messages) => {      
            messages.forEach( (msg) => {
                if (!msg.author.bot && msg.content.includes(searchedWord) && exclusionCheck(msg.content)){
                     allMsg.push(`${msg.author.username}: ${msg.content} (${msg.url})\n`); 
                }
                
            });
            // console.log('Received Messages: \n'+ allMsg.join("\n"));
        })
        .catch(console.error);
    
    channel.threads
    .create({
        name: `messages containing ${searchedWord} and excluding ${excludedWords.join(', ')}`,
        autoArchiveDuration: 60,
        reason: 'provide search result'
    }).then( threadChannel => {
        client.channels.fetch(threadChannel.id)
        .then( replyThread => {
            let len = allMsg.length;
            replyThread.send('Messages found: \n');
            //add async here so fetch in order?
            for (let i = 0; i < len; i+=4){
                replyThread.send(allMsg.slice(i,i+3).join('\n'));
            }
            let remain = len%3;
            if (remain!=0) {replyThread.send(allMsg.slice(-remain).join('\n'));}
        })
        .catch(console.error);
    }).catch(console.error)
});

// channelName = 
// const channel = new Discord.channel()

// channel.messages.fetch({ limit: 10 })
//   .then(messages => console.log(`Received ${messages.size} messages`))
//   .catch(console.error);

client.login(config.BOT_TOKEN);
