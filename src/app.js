//Imports the Twitch Messaging Interface Library
import tmi from 'tmi.js'
//Imports the Channel Details Variables 
import { BLOCKED_WORDS, BOT_USERNAME, CHANNEL_NAME, OAUTH_TOKEN } from './constants';
const whiffCount=0;
//Connecting to Channel
const options={
    options: { debug: true },
	connection: { reconnect: true },
	identity: {
		username: BOT_USERNAME,
		password: OAUTH_TOKEN
	},
	channels: [ CHANNEL_NAME ]
}

const client = new tmi.Client(options);
client.connect();

// Here each message gets checked for commands or moderation
client.on('message', (channel, userstate, message, self) => {
	// Ignore echoed messages.
	if(userstate.username === BOT_USERNAME) return;

	checkChat(userstate,message,channel)

	if(self || !message.startsWith('!')) {
		return;
	}
	
	//Divides the user command into 2 parts the command description and the command arguments if any there
	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();
	
	//!hello
	if(command === 'hello') {
		client.say(channel, `@${userstate.username} Welcome to the Club! `);
	}
	//Intro- Give a small Introduction about the streamer
	else if(command === 'intro'){
		client.say(channel, `Add any introduction about the broadcaster for the audience to know`)
	}
	//!dice
	else if(command === 'dice'){
		const rolled = Math.floor(Math.random()*6)+1;
		if(args>=1 && args<=6){
			if(args == rolled){
				client.say(channel, `Damn You are Lucky @${userstate.username}!! You rolled a ${rolled} POGGERS!`)
			}
			else{
				client.say(channel, `Ahhaa! Gotcha!! @${userstate.username} You rolled a ${rolled} not ${args}! Better Luck next time KEKW!`)
			}
		}	
		else{
			return;
		}
	}
	//!Twitter
	else if(command === 'twitter'){
		client.say(channel, `Here's the twitter bois! <Add Twitter Link here>`)
	}
	//!Instagram
	else if(command === 'insta'){
		client.say(channel, `Here's the Insta bois! <Add Instagram Link here> `)
	}
	//Youtube
	else if(command ==='youtube'){
		client.say(channel, `Here's the Youtube bois! <Add Youtube Link here> `)
	}
	//!Whiff
	else if(command === 'whiff'){
		client.say(channel, `The man is dreaming and shooting peepoSad `)
	}
	//!Rank
	else if(command === 'rank'){
		client.say(channel, `He is <Add Rank here> `)
	}
	//Sens- Gives user the sensitivity of the mouse the streamer is using
	else if(command === 'sens'){
		client.say(channel, `Sensitivity : 0.4, 800 Dpi`)
	}
	//whiffcount - This command increments whenever called and returns the user a message the number of times the player whiffed
	else if(command === 'whiffcount'){
		whiffCount++;
		client.say(channel, `<Player-Name> had whiffed ${whiffCount} times KEKW KEKW`)
	}

});

//This displays a message in the channel chat whenever a user has subbed to the channel
client.on("subscription", function (channel, username,message, methods ) {
	client.say(channel, username + " Has subscribed PogChamp!! LFGGG" )
	client.say(message);	
});
//This displays a message in the channel chat whenever a user has resubbed to the channel
client.on("resub", function (channel, username, months, message, userstate, methods) {	
	client.say(channel, username + " Has subscribed for " + months + " months in a row !! LETSAAGOOOOO " )
});


/* This is the function used to moderate the continuous chat messages and delete the message 
if any content matches to the blocked words according to the channel moderation policy and warns the user */
function checkChat(userstate,message,channel){
    let flagMessage=false;

	//Convert message into lowercase and compare it with every blocked word on the channel
    message=message.toLowerCase();
    flagMessage=BLOCKED_WORDS.some(blockedword => message.includes(blockedword.toLowerCase()))

	//If Identidied as a Flagged message then user is warned and message is deleted
    if(flagMessage){ 
        client.say(channel, `Ayoo @${userstate.username} Calm down man!`)
        client.deletemessage(channel, userstate.id)
    }    
}