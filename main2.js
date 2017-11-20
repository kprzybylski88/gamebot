/*
			***
This class is discord client with some necessary initial message handling.
It also stores user's games as they connect (Game class and this.games array);
			***
*/
//Game class - a per user class that handles their gaming commands, stores currently playing hero etc (see ./Game.js for more details).
const Game = require("./Game.js");
//discord client class. Handles messages send by and to user.
const Discord = require("discord.js");
//a class to enable message sending/receiving. Also used to async communicate between classes. See ./MessageProcessor.js for more info
const MessageProcessor = require("./MessageProcessor.js");
//configuration file with discord token, message prefix for general chat and maybe more in the future
const config = require("./datafiles/config.json");
//const Hero = require("./Hero.js");
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
					console.log(this.games);
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