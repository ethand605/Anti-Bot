const Discord = require("discord.js");
const config = require("./config.json");

/*
TODO:
capture include and exclude words 
##fetch from all channels
##write a function that accepts channel id then fetch
feetch more than 100
##sort by date .createdTimeStamp
?change from opening thread to embed with pagination
https://discord.js.org/#/docs/main/stable/class/Webhook
*/

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

const prefix = "/";
const searchedWords = [];
const excludedWords = []; //TODO: why is / not displaying

function exclusionCheck(msg){
    found = false;
    excludedWords.forEach((word) => {
        if (msg.includes(word)) { found = true;}
    })
    return !found;
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
            if (!msg.author.bot && foundWord(msg.content.toLowerCase()) 
            //turn this into checking an array off searchedWords
                && exclusionCheck(msg.content)) {
                    allMsg[msg.createdTimestamp]=  `${msg.author.username}: ${msg.content} (${msg.url})\n`;
            }
        })        
    }
    // console.log(allMsg);
}

function foundWord(content) {
    let found = true;
    for (let word of searchedWords){
        if(!content.includes(word)) found = false;
    }
    return found;
}

client.on("messageCreate",  (message) => {
    if (message.author.bot) return; 
    if (!message.content.startsWith(prefix)) return;
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    if (!command=='search') return;
    
    let searchedWord = '';
    //why didn't this work??
    // while(!searchedWord.startsWith('\-') && args.length!=0){
    //     searchedWords.push(args.shift().toLowerCase());
    // }
    while(searchedWord[0]!=='-' && args.length!=0){
        console.log(searchedWord.indexOf('-'));
        searchedWords.push(args.shift().toLowerCase());
    }
    while(args.length!=0){
        excludedWords.push(args.shift().toLowerCase());
    }

    console.log(searchedWords, excludedWords);
    /*
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
            channel.threads
                .create({
                    name: `messages containing ${searchedWord} and excluding ${excludedWords.join(', ')}`,
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
    */
});



client.login(config.BOT_TOKEN);
