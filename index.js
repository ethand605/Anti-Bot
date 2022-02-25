const Discord = require("discord.js");
const config = require("./config.json");

/*
TODO:
fetch from all channels:
    write a function that accepts channel id then fetch
capture include and exclude words 
sort by date .createdTimeStamp
add async to wait for fetch before displaying (chain resolve promises?)
change from opening thread to embed with pagination
*/

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

const prefix = "/";
const searchedWord = "122d";
const excludedWords = ["/", "role"];

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
    
    // let channel = message.channel;

    //fetch all channels
    message.guild.channels.fetch()
        .then( (channels) => {
            let chanIDs = [];
            channels.forEach( (channel) => {
                if(channel.type==='GUILD_TEXT') chanIDs.push(channel.id);
            })
            return chanIDs;
        })
        .then( (chanIDs) => {
            console.log(chanIDs.length);
        })
        /*
        .then(fetch all messages)
        .then(create thread)
        */
    
    // let allMsg = {};
    // channel.messages.fetch({ limit: 100 })
    //     .then( (messages) => {      
    //         messages.forEach( (msg) => {
    //             if (!msg.author.bot && msg.content.includes(searchedWord) && exclusionCheck(msg.content)){
    //                  allMsg[msg.createdTimestamp]=  `${msg.author.username}: ${msg.content} (${msg.url})\n`; 
    //             }
    //         });
            
    //     }).then( () => {
    //         channel.threads
    //             .create({
    //                 name: `messages containing ${searchedWord} and excluding ${excludedWords.join(', ')}`,
    //                 autoArchiveDuration: 60,
    //                 reason: 'provide search result'
    //             }).then( threadChannel => {
    //                 client.channels.fetch(threadChannel.id)
    //                 .then( replyThread => {
    //                     replyThread.send('Messages found: \n');
    //                     let times = Object.keys(allMsg);
    //                     times = Array.from(times.sort().reverse());
    //                     for (let i = 0;i<times.length;i++){
    //                         replyThread.send(allMsg[times[i]]+'\n');
    //                     }
    //                 })
    //                 .catch(console.error);
    //             })
    //             .catch(console.error);
    
    // }).catch(console.error)
    
});



client.login(config.BOT_TOKEN);
