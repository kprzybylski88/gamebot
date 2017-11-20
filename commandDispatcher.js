const stateFilePairs= require("./datafiles/stateFile.json");
class CommandDispatcher {
	constructor(messageComm,player) {
		this.messageComm = messageComm;
		this.unitName="commandDispatcher";
		this.breakCommand = function(message){
			if (message.indexOf(" ")===-1) return {"command":message,"args":[]};
			var command = message.split(" ")[0];
			var argsRaw = message.substring(message.indexOf(command)+command.length+1,message.length);//.split[" "];
			if (argsRaw.indexOf(" ")===-1){console.log("got"); argsRaw = [argsRaw]} else argsRaw = argsRaw.split(" ");
			console.log(argsRaw);
			if (message.indexOf("\"")>-1) {
				var newArgs=[];
				var quotedArgsArr =[];
				var quotedArg = false;
				for(var i = 0; i<argsRaw.length;++i) {
					if (argsRaw[i].indexOf("\"")===0) quotedArg = true;
					if (quotedArg) {quotedArgsArr.push(argsRaw[i])} else {newArgs.push(argsRaw[i])}
					if (argsRaw[i].indexOf("\"")===argsRaw[i].length-1) {
						quotedArg = false;
						var tempQuotedArg = quotedArgsArr.join(" ");
						newArgs.push(tempQuotedArg.substring(1,tempQuotedArg.length-1));
						quotedArgsArr = [];
					}
				}
				console.log(newArgs);
				return {"command":command,"args":newArgs}
			} else return {"command":command,"args":argsRaw}

			
		}

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
			var messageSpltd = this.breakCommand(message);
			var command = messageSpltd.command;
			var args = messageSpltd.args;
			if(!commandFile[command]) {
				this.messageComm.respond(this.unitName,this.player,"NoCanDo");
				return false;
			}
			return {"command":commandFile[command],"args":args};
		}
	}
}
commandDispatcher = new CommandDispatcher(false,false);
//var testRes = commandDispatcher.breakCommand("dupa i przed tez \"zupa str\" cos jeszcze \"a pozniej jeszcze inaczej\" boo");
//console.log(testRes.args[0])
module.exports=CommandDispatcher;