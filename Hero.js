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
		
		this.listInventory = function() {
			var items = ""
			for(var i=0; i<this.inventory.length;++i) {
				items+="\n"+this.inventory[i].name;
			}
			if (items.length === 0) items = " nothing"
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
		this.take = function(items) {
			if (!items) return false;
			for (var i = 0; i<items.length;++i) {
				this.inventory.push(items[i]);
			}
		}

		this.getItemsIndexByName = function(name) {
			
			if (this.inventory.length===0) return false;
			var rItems =[];
			for (var i=0;i<this.inventory.length;++i) {
				if (this.inventory[i].name.indexOf(name) === 0) rItems.push(i);
			}
			if (rItems.length === 0) return false;
			return rItems;
		}
		this.deleteItemsByIndex = function(indexes){
			try{
				for(var i=0;i<indexes.length;++i) {
					this.inventory[indexes[i]]= "deleted";
				}
				for (var i=0;i<this.inventory.length;++i) {
					if (this.inventory[i] === "deleted") {this.inventory.splice(i,1); --i}
				}
				console.log(this.inventory);
			} catch (err) {
				console.log(err);
				return false;
			}
			return true;
		}
		
		this.drop = function(command) {
			if (this.inventory.length === 0) {
				this.messageComm.respond(this.unitName,this.player,"You have nothing to drop. Poor you");
				return false;
			}
			var itemName=command[0];
			console.log(itemName);
			var options=command[1];
			var toDelete=[];
			var toReturn=[];
			var itemsIndex = this.getItemsIndexByName(itemName);
			if (!itemsIndex) return false;
			if (!options) {
				toReturn.push(this.inventory[itemsIndex[0]]);
				toDelete.push(itemsIndex[0]);
			} else if (options === "all") {
				for (var i = 0;i<itemsIndex.length;++i) {
					toReturn.push(this.inventory[itemsIndex[i]]);
					toDelete.push(itemsIndex[i]);
				}
			} else {
				try {
					toReturn.push(this.inventory[itemsIndex[options-1]]);
					toDelete.push(itemsIndex[options-1]);
				} catch (err) {
					console.log(err);
					return false;
				}
			}

			console.log("item name: "+itemName+"\noptions: "+options);
			if (toReturn.length>0) {
				this.deleteItemsByIndex(toDelete);
				return toReturn;
			}
			return false;
			
		}
		
		//-----------------------------!!!!!HERE WE WALK!!!!-------------------------------//

		
		this.walk = function(x,y,z) {
			try {
				//this.map[this.position.x+x][this.position.y+y][this.position.z+z]
				this.position.x+=x;
				this.position.y+=y;
				this.position.z+=z;
				//this.describe();
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