const stateFilePairs= require("./datafiles/stateFile.json");
class commandDispatcher {
	constructor(messageComm,player) {
		this.messageComm = messageComm;
		this.unitName="commandDispatcher";

		this.translateCommand = function(gamestate,herostate,message){
			if(!stateFilePairs[gamestate+herostate]) {
				this.messageComm.respond(this.unitName,this.player,"Error!");
				console.log(gamestate+herostate);
				return false
			};
			var commandFile;
			if(stateFilePairs[gamestate+herostate] === "free string") {
				var commandFile = require("./datafiles/freeStringCommands.json");
				return {"command":commandFile[gamestate+herostate],"args":message}
			}
			var commandFile = require(stateFilePairs[gamestate+herostate])
			var args = message.split(" ");
			var command = args.shift();
			if(!commandFile[command]) {
				this.messageComm.respond(this.unitName,this.player,"NoCanDo");
				return false;
			}
			return {"command":commandFile[command],"args":args};
		}
	}
}
module.exports=commandDispatcher;