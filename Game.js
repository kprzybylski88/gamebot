const Hero = require("./Hero.js");
const Map = require("./Map.js")
const CommandDispatcher = require("./commandDispatcher.js");
class Game {
	constructor(player, messageComm) {
		this.map = new Map(player,messageComm);
		this.messageComm = messageComm; 
		this.commandDispatcher = new CommandDispatcher(this.messageComm,this.player);
		this.act = function(commandWithArgs) {
			console.log (this.state)
			switch(commandWithArgs.command) {
				case "renamehero" :
					if (this.hero.rename(commandWithArgs.args) === "playing") {
						this.state="playing";this.messageComm.respond(this.unitName,this.player,this.map.describe(this.hero.position.x,this.hero.position.y,this.hero.position.z));
					}
					break;
				case "walke":
					this.movement(1,0,0);
					break;
				case "walks": 
					this.movement(0,1,0);
					break;
				case "walku": 
					this.movement(0,0,1);
					break;
				case "walkw": 
					this.movement(-1,0,0);
					break;
				case "walkn": 
					this.movement(0,-1,0);
					break;
				case "walkd": 
					this.movement(0,0,-1);
					break;
				case "takeitem":
					var items = this.map.giveItems(commandWithArgs.args,this.hero.position.x,this.hero.position.y,this.hero.position.z);
					console.log (items);
					if (items) this.hero.take(items);
					break;
				case "locationdescribe":
					this.messageComm.respond(this.unitName,this.player,this.map.describe(this.hero.position.x,this.hero.position.y,this.hero.position.z));
					break;
				case "listinventory":
					this.hero.listInventory();
					break;
				case "dropitem":
					var items = this.hero.drop(commandWithArgs.args);
					if (items) this.map.takeItems(items,this.hero.position.x,this.hero.position.y,this.hero.position.z);
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
	

	movement(x,y,z) {
		if (this.map.testPosition(this.hero.position.x + x, this.hero.position.y + y, this.hero.position.z + z)) {
			this.hero.walk(x, y, z);
			this.messageComm.respond(this.unitName,this.player,this.map.describe(this.hero.position.x,this.hero.position.y,this.hero.position.z));
		} else {
			this.messageComm.respond(this.unitName,this.player,"You cannot go there");
		}
	}
}
module.exports = Game;