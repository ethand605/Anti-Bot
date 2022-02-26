const Discord = require("discord.js");
const config = require("./config.json");

/*
TODO:
feetch more than 100
?change from opening thread to embed with pagination
https://discord.js.org/#/docs/main/stable/class/Webhook
*/

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

const prefix = "/";
const includedWords = [];
const excludedWords = []; //TODO: why is / not displaying

function exclusionCheck(msg){
    found = false;
    excludedWords.forEach((word) => {
        if (msg.includes(word)) { found = true;}
    })
    return !found;
}

function inclusionCheck(msg){
    found = true;
    includedWords.forEach((word) => {
        if (!msg.includes(word)) { found = false;}
    })
    return found;
}

async function fetchAllmessages(allMsg, IDs, guild) {
    for(let id of IDs){      
        let channel = await guild.channels.fetch(id); //the channel to be searched
        /*
        while(true){ //something is wrong with this
            let messages = await channel.messages.fetch({ limit: 100 });
            
            if(!messages.last()) {
                break; //break out of while loop if there is no more messages to be searched
            }

            messages.forEach( (msg) => {
                if (!msg.author.bot && msg.content.includes(searchedWord) 
                    && exclusionCheck(msg.content)) {
                        allMsg[msg.createdTimestamp]=  `${msg.author.username}: ${msg.content} (${msg.url})\n`;
                }
            })
            console.log(allMsg);

        }
        */
        
        let messages = await channel.messages.fetch({ limit: 100 }); //find a way to work around discord's limit
        
        messages.forEach( (msg) => {

            if (!msg.author.bot && inclusionCheck(msg.content.toLowerCase())
                && exclusionCheck(msg.content.toLowerCase())) {
                    allMsg[msg.createdTimestamp]=  `${msg.author.username}: ${msg.content} (${msg.url})\n`;
            }
        })        
    }
}


client.on("messageCreate",  (message) => {
    if (message.author.bot) return; 
    if (!message.content.startsWith(prefix)) return;
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    if (!command=='search') return;
    
    while(args[0].indexOf('-')!==0 && args.length!=0){
        includedWords.push(args.shift().toLowerCase());
    }
    while(args.length!=0){
        excludedWords.push(args.shift().toLowerCase());
    }

    // console.log(searchedWords, excludedWords);
    
    let gld = message.guild;
    let channel = message.channel;
    //fetch all channels
    gld.channels.fetch()
        //get a collection of IDs
        .then( (channels) => {
            let chanIDs = [];
            channels.forEach( (channel) => {
                if(channel.type==='GUILD_TEXT') chanIDs.push(channel.id);
            })
            return chanIDs;
        })
        .then(async (chanIDs) => {
            //using the collection of IDs to fetch all messages in the server the fits the requirement
            let allMsg = {};
            await fetchAllmessages(allMsg, chanIDs, gld);
            return allMsg;
        })
        .then( (allMsg) => {
            //create a thread, sort the messages by created time, then sends them out in the thread
            const exclWords = excludedWords.map( word => word.substring(1));
            // console.log(excludedWords);
            channel.threads
                .create({
                    name: `messages containing ${includedWords.join(', ')} and excluding ${exclWords.join(', ')}`,
                    autoArchiveDuration: 60,
                    reason: 'provide search result'
                }).then( threadChannel => {
                    client.channels.fetch(threadChannel.id)
                    .then( replyThread => {
                        replyThread.send('Messages found: \n');
                        let timeStamps = Object.keys(allMsg).sort().reverse();
                        for (let key of timeStamps){
                            replyThread.send(allMsg[key]+'\n');
                        }
                    })
                    .catch(console.error);
                })
                .catch(console.error);
        })
    
});



client.login(config.BOT_TOKEN);
