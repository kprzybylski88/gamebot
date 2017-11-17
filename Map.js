class Map {
	constructor(messageComm,player) {
		this.messageComm = messageComm;
		this.player = player;
		this.mapJson = require("./datafiles/newMap.json");
		this.unitName = "Map";
		this.testPosition = function(x,y,z){
			if (this.mapJson[x][y][z]) {return true} else {return false};
		};
		this.describe = function(x,y,z) {
			var mapField = this.mapJson[x][y][z];
			if(!mapField) return false;
			var returnMessage = mapField.description;
			var items = "";
			var verb = "is"
			if (mapField.items.length > 0) {
				for (var i=0;i<mapField.items.length;++i) {
					if (i === 1) verb = "are";
					items += mapField.items[i].name+"\n";
				}
			}
			if (items.length>0) returnMessage+="\n"+items+verb+" lying here";
			returnMessage+="\npossible exits:\n"+mapField.exits;
			return returnMessage;	
		}
		this.getItemsIndexByName = function(name,x,y,z) {
			var mapField = this.mapJson[x][y][z];
			if (!mapField || !mapField.items) return false;
			var rItems =[];
			for (var i=0;i<mapField.items.length;++i) {
				if (mapField.items[i].name.indexOf(name) === 0) rItems.push(i);
			}
			if (rItems.length === 0) return false;
			return rItems;
		}
		this.deleteItemsByIndex = function(indexes,x,y,z){
			try{
				for(var i=0;i<indexes.length;++i) {
					this.mapJson[x][y][x].items[indexes[i]]= "deleted";
				}
				for (var i=0;i<this.mapJson[x][y][z].items.length;++i) {
					if (this.mapJson[x][y][z].items[i] === "deleted") {this.mapJson[x][y][z].items.splice(i,1); --i}
				}
				console.log(this.mapJson[x][y][z].items);
			} catch (err) {
				console.log(err);
				return false;
			}
			return true;
		}
		this.giveItems = function(command,x,y,z) {
			var itemName="";
			var options="";
			var toDelete=[];
			var toReturn=[];
			if (command.indexOf("\"")===0) {
				var newCommArr = command.split("\"").splice(1);
				itemName = newCommArr.splice(0,1);
				options = newCommArr[0];
			} else {
				var newCommArr = command.split(" ");
				itemName = newCommArr[0];
				if (newCommArr.length>1) options = newCommArr[1];
			}
			var itemsIndex = this.getItemsIndexByName(itemName,x,y,z);
			if (!itemsIndex) return false;
			if (options.length === 0) {
				toReturn.push(this.mapJson[x][y][z].items[itemsIndex[0]]);
				toDelete.push(itemsIndex[0]);
			} else if (options === "all") {
				for (var i = 0;i<itemsIndex.length;++i) {
					toReturn.push(this.mapJson[x][y][z].items[itemsIndex[i]]);
					toDelete.push(itemsIndex[i]);
				}
			} else {
				try {
					toReturn.push(this.mapJson[x][y][z].items[itemsIndex[options-1]]);
					toDelete.push(itemsIndex[options-1]);
				} catch (err) {
					console.log(err);
					return false;
				}
			}

			console.log("item name: "+itemName+"\noptions: "+options);
			if (toReturn.length>0) {
				this.deleteItemsByIndex(toDelete,x,y,z);
				return toReturn;
			}
			return false;
		}

		this.takeItems = function(items,x,y,z) {
			if (!this.mapJson[x][y][z]) return false;
			if (!this.mapJson[x][y][z].items) this.mapJson[x][y][z].items=[];
			for (var i = 0; i<items.length; ++i) {
				this.mapJson[x][y][z].items.push(items[i]);
			}
			for (var i = 0;i<this.mapJson[x][y][z].items.length;++i) console.log(this.mapJson[x][y][z].items[i].name);
		}
	}
}
var map = new Map(false,false)
//console.log("item name: "+map.giveItems("wombat all",1,1,1)[0].name);
map.takeItems([{"name":"foo"},{"name":"bar"}],1,1,1);

console.log(map.mapJson[1][1][1].items.length);
//module.exports = Map; 