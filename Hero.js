class Hero {
	constructor(heroData,player,messageComm) {
		this.map = require("./datafiles/newMap.json");
		this.messageComm = messageComm;
		this.state = "new";
		this.inventory = [];
		this.createHero = function() {
			this.position = {x:0,y:0,z:0};
			this.messageComm.respond(this.unitName,this.player,"Name your hero!");
			this.state = "naming";
		}
		this.rename = function(newName) {
			this.name = newName;
			this.messageComm.respond(this.unitName,this.player,"Your hero has been named: "+newName);
			switch (this.state) {
				case "naming" :
					this.state = "playing";
					return this.state;
					break;
			}
		}
		this.player = player;
		this.unitName = "Hero";
		if (heroData) {
			this.name = heroData.name;
			//here we'll load The Rest™
			this.state="playing";
		} else {
			this.createHero();
		}
		this.describe = function() {
				var mapField = this.map[this.position.x][this.position.y][this.position.z];
				//this.messageComm.respond(this.unitName,this.player,mapField.description);
				var items = "";
				var verb = "is"
				try {
					for (var i=0;true;++i) {
						if (!mapField.items[i]) break;
						if (i === 1) verb = "are";
						items += mapField.items[i].name+"\n";
					}
					//this.messageComm.respond(this.unitName,this.player,items+"are lying here");
				} catch (err) {
					console.log("nothing to see here")
				}
				var message = mapField.description;
				if (items.length>0) message+="\n"+items+verb+" lying here";
				message+="\npossible exits:\n"+mapField.exits;
				this.messageComm.respond(this.unitName,this.player,message);
				//console.log(mapField);
		}
		
		this.listInventory = function() {
			var items = ""
			for(var i=0; i<this.inventory.length;++i) {
				items+="\n"+this.inventory[i].name
			}
			this.messageComm.respond(this.unitName,this.player,"You carry:"+items);
		}
		
		
		//-----------------------------!!!!!HERE WE TAKE ITEMS!!!!-------------------------------//
		
		this.retrieveAllItems = function(namePartial,items) {
			var allItems=[];
			for (var i=0;i<items.length;++i) {
				console.log(items[i]);
				if(items[i].name.indexOf(namePartial) === 0) allItems.push(i);
			}
			if (allItems.length === 0) return false;
			return allItems;
			
		}
		this.take = function(itemCommand) {
			var mapFieldItems = this.map[this.position.x][this.position.y][this.position.z].items;
			if (!mapFieldItems || mapFieldItems.length === 0) {
				this.messageComm.respond(this.unitName,this.player,"Nothing to pick up! This is embarassing! :see_no_evil:")
				return false;
			}
			var item = itemCommand.shift();
			var itemsWithName = this.retrieveAllItems(item,mapFieldItems);
			if (!itemsWithName) {
				this.messageComm.respond(this.unitName,this.player,"No such item found");
				return false;
			}
			
			if (itemCommand.length>0) {
				if (itemCommand[0] === "all"){
					var itemsForMessage = "";
					//console.log(itemsWithName);
					for (var i=0;i<itemsWithName.length;++i) {
						var itemToInsert = this.map[this.position.x][this.position.y][this.position.z].items.splice(itemsWithName[i]-i,1);
						itemsForMessage += itemToInsert[0].name+" ";
						this.inventory.push(itemToInsert[0])
					}
					if (itemsForMessage.length > 0) {
						this.messageComm.respond(this.unitName,this.player,itemsForMessage+"taken");
					} else {
						this.messageComm.respond(this.unitName,this.player,"No such item found");
					}
				} else {
					try {
						var itemToInsert = this.map[this.position.x][this.position.y][this.position.z].items.splice(itemsWithName[itemCommand-1],1);
						this.inventory.push(itemToInsert[0]);
						this.messageComm.respond(this.unitName,this.player,itemToInsert[0].name+" taken");
					} catch(err){
						console.log("No item taken");
						this.messageComm.respond(this.unitName,this.player,"Unfortunately, you took nothing.");
					}
				}
			} else {
				var itemToInsert = this.map[this.position.x][this.position.y][this.position.z].items.splice(itemsWithName[0],1);
				this.inventory.push(itemToInsert[0]);
				this.messageComm.respond(this.unitName,this.player,itemToInsert[0].name+" taken");
			}
			//console.log(this.map.items);
			//console.log(this.inventory);
		}
		
		this.drop = function(itemCommand) {
			if (this.inventory.length === 0) {
				this.messageComm.respond(this.unitName,this.player,"You have nothing to drop. Poor you");
				return false;
			}
			var item = itemCommand.shift()
			var itemsWithName = this.retrieveAllItems(item,this.inventory);
			if (!itemsWithName) {
				this.messageComm.respond(this.unitName,this.player,"Unfortunately, you don't have this.");
				return false;
			}
			if (!this.map[this.position.x][this.position.y][this.position.z].items) this.map[this.position.x][this.position.y][this.position.z].items =[];
			
			if (itemCommand.length === 0) {
				var itemToDrop = this.inventory.splice(itemsWithName[0],1);
				this.map[this.position.x][this.position.y][this.position.z].items.push(itemToDrop[0]);
				this.messageComm.respond(this.unitName,this.player,"You dropped: "+itemToDrop[0].name);
				return true;
			}
			if(itemCommand[0] === "all") {
				var itemsForMessage = "";
				for (var i=0;i<itemsWithName.length;++i) {
					var itemToDrop = this.inventory.splice(itemsWithName[i]-i,1);
					itemsForMessage += itemToDrop[0].name+" ";
					this.map[this.position.x][this.position.y][this.position.z].items.push(itemToDrop[0]);
				}
				if (itemsForMessage.length > 0) {
						this.messageComm.respond(this.unitName,this.player,itemsForMessage+"dropped");
				} else {
					this.messageComm.respond(this.unitName,this.player,"No such item found");
				}
			} else {
			try {
					var itemToDrop = this.inventory.splice(itemsWithName[itemCommand-1],1);
					this.map[this.position.x][this.position.y][this.position.z].items.push(itemToDrop[0]);
					this.messageComm.respond(this.unitName,this.player,itemDrop[0].name+" dropped.");
				} catch(err){
					console.log("No item dropped");
					this.messageComm.respond(this.unitName,this.player,"Unfortunately, you dropped nothing.");
				}
			}
			
		}
		
		//-----------------------------!!!!!HERE WE WALK!!!!-------------------------------//

		
		this.walk = function(x,y,z) {
			try {
				this.map[this.position.x+x][this.position.y+y][this.position.z+z]
				this.position.x+=x;
				this.position.y+=y;
				this.position.z+=z;
				this.describe();
			} catch (err) {
				this.messageComm.respond(this.unitName,this.player,"You cannot go there!");
			}
		}
		this.messageComm.on(this.unitName,(author,message)=>{
			console.log("Hero message received");
		})
		
		
	}
}
module.exports = Hero;