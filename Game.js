const Hero = require("./Hero.js");
const CommandDispatcher = require("./commandDispatcher.js");
class Game {
	constructor(player, messageComm) {
		this.messageComm = messageComm; 
		this.commandDispatcher = new CommandDispatcher(this.messageComm,this.player);
		this.act = function(commandWithArgs) {
			console.log (this.state)
			switch(commandWithArgs.command) {
				case "renamehero" :
					if (this.hero.rename(commandWithArgs.args) === "playing") {this.state="playing";console.log("changed! "+this.state)}
					break;
				case "walke": 
					this.hero.walk(1,0,0);
					break;
				case "walks": 
					this.hero.walk(0,1,0);
					break;
				case "walku": 
					this.hero.walk(0,0,1);
					break;
				case "walkw": 
					this.hero.walk(-1,0,0);
					break;
				case "walkn": 
					this.hero.walk(0,-1,0);
					break;
				case "walkd": 
					this.hero.walk(0,0,-1);
					break;
				case "takeitem": 
					this.hero.take(commandWithArgs.args);
					break;
				case "locationdescribe":
					this.hero.describe();
					break;
				case "listinventory":
					this.hero.listInventory();
					break;
				case "dropitem":
					this.hero.drop(commandWithArgs.args);
					break;
			}
		}
		this.checkForSaved = function(playerId) {
			return false;
		}
		
		this.startNew = function(id) {
			this.state = "creating";
			this.messageComm.respond(this.unitName,this.player,"Creating new hero!");
			this.hero = new Hero(false,this.player,this.messageComm);
		}
		this.dispatch = function(message) {
			var processedMessage = this.commandDispatcher.translateCommand(this.state,this.hero.state,message);
			console.log(processedMessage);
			this.act(processedMessage);
		}

		//this.Map = require("./Map.js");

		this.unitName = "Game"
		this.state = "startgame";
		this.player = player;
		
		var savedGames = this.checkForSaved(this.player.id);
		if (savedGames) {
			if (this.promptForLoad(savedGames)){
				this.loadGame(savedGames);
			} else {
				this.startNew(this.player.id);
			}
		} else {
			this.messageComm.respond(this.unitName,player,"No saved games found.");
			this.startNew(this.player.id);
		}
		
		
		
		
		
		this.messageComm.on(this.unitName,(author,message)=>{
			switch(message) {
				case "Hero:ready":
					this.state="playing";
					this.map = new this.Map(this.hero.position,this.messageComm,this.player);
					this.map.describe();
					break;
			}
		});
		
	}
	
}
module.exports = Game;