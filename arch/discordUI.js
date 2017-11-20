//a class that will make a pretty game UI using discord bot. It communicates with game receiving data to display and passes user input
module.exports = Interface;
const Discord = require('discord.js');
const MessageProcessor = require('./messageprocessor.js');
function Interface() {
	var parentObj=this;
	this.uiCommands = {
		'setprompt':
			function(newPrompt)
			{
				parentObj.userPrompt= newPrompt;
				return 'prompt has been changed to: ' + parentObj.userPrompt
			}
	};
	this.client = new Discord.Client();
	this.processor = new MessageProcessor();
	this.token = 'MzM0MDE3NjU3MzE5OTgxMDU5.DEVFtA.T1r4lhWLOK7-lRCtpLaeAD4VzV4';
	//this defines prompt set by user
	this.userPrompt = 'maszciprompt';
	this.uiConfigCommand = ';configUI';
	//loads prompt set up by user
	this.loadPrompt = function() {
		var newPrommpt = "NoPrompt";
		this.userPrompt = newPrommpt;
	}
	
	this.parseUIcommand = function(command,author) {
		var commandKey = command.substr(0,command.indexOf(' '));
		var commandValue = command.substr(command.indexOf(' '),command.length);
		console.log(commandKey+" "+this.uiCommands[commandKey]);
		try {
			return this.uiCommands[commandKey](commandValue);
		} catch (error) {
			console.log(error.message);
			return 'syntax error. type: "'+this.uiConfigCommand+' help\" to show correct syntax (not working currently)';
		}
	}
	
	this.client.on('ready', () => {
		console.log('I am ready!');
	});
	
	this.client.on('message', message => {
		// Is client not the sender
		if (message.author.id !== this.client.user.id) {
			//is it the command to config UI?
			if (message.content.startsWith(this.uiConfigCommand)) {
				message.channel.send(this.parseUIcommand(message.content.replace(this.uiConfigCommand+' ',''),message.author));
			} else {
				message.channel.send(this.processor.respond(message.content));
				message.channel.send(this.userPrompt);
			}
		} else {
			console.log("not replying to my own message");
		}
	});
	this.client.login(this.token);
	
}