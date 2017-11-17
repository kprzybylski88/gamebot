const Game = require("./Game.js");
const Discord = require("discord.js");
const MessageProcessor = require("./MessageProcessor.js");
const config = require("./datafiles/config.json");
const Hero = require("./Hero.js");
class Main {
	constructor() {

		this.games = {};
		//this.map = require("./newMap.json");
		this.messageProcessor = new MessageProcessor();
		/*this.hero = new Hero(false,"whatever",this.messageProcessor);
		this.hero.take(["dupa"]);*/
		this.client = new Discord.Client();
		// Here we load the config.json file that contains our token and our prefix values. 
		this.client.on("message", async message => {
			if(message.author.bot) return;
			var authId = message.author.id;
			//console.log(message.channel.type);
			if(message.channel.type === "text"){
				if(message.content.indexOf(config.prefix)!=0) return;
				var command = message.content.substring(1,message.content.length);
				console.log(command);
				if (command === "startGame") {
					this.games[authId] = new Game(message.author,this.messageProcessor);
					//console.log(this.games);
				}
			}  else if (message.channel.type === "dm") {
				//console.log(message.content);
				if (this.games[authId]) {
					this.games[authId].dispatch(message.content);
				}
			}
				
		});
		
		this.messageProcessor.on("response",(responseUnit,destination,message) =>{
			//console.log(responseUnit);
			destination.send(message);
		});
		try {
			this.client.login(config.token);
		} catch (err) {
			console.log(err);
		}
	}
}

const main = new Main();