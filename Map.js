class Map {
	constructor(position,messageComm,player) {
		this.messageComm = messageComm;
		this.player = player;
		this.position=position;
		this.mapJson = require("./datafiles/map.json");
		this.unitName = "Map";
		this.posForJson = function(current,x,y,z) {
			if (current){
				console.log("current");
				return this.position.x+""+this.position.y+""+this.position.z+"";
			} else {
				console.log(x+""+y+""+z);
				return x+""+y+""+z+"";
			}
			
		}
		this.describe = function() {
			messageComm.respond(this.unitName,this.player,this.mapJson[this.posForJson(true)].description);
		}
		this.messageComm.on(this.unitName,(author,message)=>{
			switch(message) { 
				case "e":
					if (this.mapJson[this.posForJson(false,this.position.x+1,this.position.y,this.position.z)]) {
						this.position.x = this.position.x+1;
						this.describe();
					} else {
						messageComm.respond(this.unitName,this.player,"You cannot go there!");
					}
					console.log("e");
					break;
				case "w":
					if (this.mapJson[this.posForJson(false,this.position.x-1,this.position.y,this.position.z)]) {
						this.position.x = this.position.x-1;
						this.describe();
					} else {
						messageComm.respond(this.unitName,this.player,"You cannot go there!");
					}
					console.log("w");
					break;
				case "s":
					if (this.mapJson[this.posForJson(false,this.position.x,this.position.y+1,this.position.z)]) {
						this.position.y = this.position.y+1;
						this.describe();
					} else {
						messageComm.respond(this.unitName,this.player,"You cannot go there!");
					}
					console.log("s");
					break;
				case "n":
					if (this.mapJson[this.posForJson(false,this.position.x,this.position.y-1,this.position.z)]) {
						this.position.y = this.position.y-1;
						this.describe();
					} else {
						messageComm.respond(this.unitName,this.player,"You cannot go there!");
					}
					console.log("n");
					break;
				case "u":
					if (this.mapJson[this.posForJson(false,this.position.x,this.position.y,this.position.z+1)]) {
						this.position.z = this.position.z+1;
						this.describe();
					} else {
						messageComm.respond(this.unitName,this.player,"You cannot go there!");
					}
					console.log("u");
					break;
				case "d":
					if (this.mapJson[this.posForJson(false,this.position.x,this.position.y,this.position.z-1)]) {
						this.position.z = this.position.z-1;
						this.describe();
					} else {
						messageComm.respond(this.unitName,this.player,"You cannot go there!");
					}
					console.log("u");
					break;
				case "describe":
					this.describe();
					break;
				
			}
			this.messageComm.processMessage("Hero",this.player,"positionUpdate"+this.position.x+""+this.position.y+""+this.position.y);
			
		});
	}
}
module.exports = Map;