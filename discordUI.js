//a class that will make a pretty game UI using discord bot. It communicates with game receiving data to display and passes user input
module.exports = Interface;
const Discord = require('discord.js');
const MessageProcessor = require('./messageprocessor.js');
function Interface() {
	var parentObj=this;
	//object to store command - function pairs to configure UI
	this.uiCommands = {
		'setprompt':
			function(newPrompt) {
				parentObj.userPrompt= newPrompt;
				return 'prompt has been changed to: ' + parentObj.userPrompt
			},
			
		'switchPrompt':
			function(state) {
				if (state === 'off'){
					parentObj.displayPrompt = false;
					return 'prompt off';
				} else if (state === 'on')  {
					parentObj.displayPrompt = true;
					return 'prompt on';
				}
				return 'Invalid syntax. Proper usage: "'+parentObj.uiConfigCommand+' switchPrompt on/off"'; 
			}
	};
	//initializing discord client
	this.client = new Discord.Client();
	
	//loading game processor
	this.processor = new MessageProcessor();
	this.token = 'MzM0MDE3NjU3MzE5OTgxMDU5.DEVFtA.T1r4lhWLOK7-lRCtpLaeAD4VzV4';
	//this defines prompt set by user
	this.displayPrompt = false;
	this.userPrompt = 'no prompt';
	this.uiConfigCommand = ';configUI';
	//loads prompt set up by user
	this.loadPrompt = function() {
		var newPrommpt = "NoPrompt";
		this.userPrompt = newPrommpt;
	}
	
	this.parseUIcommand = function(command,author) {
		var commandKey = command.substr(0,command.indexOf(' '));
		var commandValue = command.substr(command.indexOf(' ')+1,command.length);
		console.log(commandKey+" "+this.uiCommands[commandKey]);
		try {
			return this.uiCommands[commandKey](commandValue);
		} catch (error) {
			console.log(error.message);
			return 'Syntax error. type: "'+this.uiConfigCommand+' help\" to show correct syntax (not working currently)';
		}
	}
	
	this.client.on('ready', () => {
		console.log('I am ready!');
	});
	
	this.client.on('message', message => {
		/*if (message.author.id !== this.client.user.id) {
			if (response) {
				for (var i =0; i< response.length; ++i) {
					switch (response[i].receipent) {
						case 'author':
							message.author.sendMessage(response[i].content);
							break;
						
						case 'channel':
							message.channel
					}
				}
			}
		}*/
		
		// Is client not the sender
		if (message.author.id !== this.client.user.id) {
			//check if the command to config UI
			if (message.content.startsWith(this.uiConfigCommand)) {
				message.channel.send(this.parseUIcommand(message.content.replace(this.uiConfigCommand+' ',''),message.author));
			} else {
				var response = this.processor.respond(message.content, message.author.id);
				if (response) {
					message.channel.send(response[0]);
					if (response.length>1) {
						message.author.sendMessage(response[1]);
					}
				}
				if (this.displayPrompt)
					message.channel.send(this.userPrompt);
			}
		} else {
			console.log("not replying to my own message");
		}
	});
	this.client.login(this.token);
	
}