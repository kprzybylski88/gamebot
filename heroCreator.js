module.exports = Hero;
function Hero (boolIsLoadTrueFlag,usernameFromUI,mainMessageEventHandler) {
	this.returnMessageEventEmmiter = mainMessageEventHandler;
	this.createHero = function(channel){
		//console.log(channel);
		if (channel){
			this.returnMessageEventEmmiter.emit("returnMessage","What is the name of your hero?",channel);
		}
	}
	parentObject = this; 
	this.username="";
	this.heroName="";
	if (boolIsLoadTrueFlag) {
		require("./savedg/"+username+".json")
	} else {
		this.username = usernameFromUI;
		this.createHero();
	}
		
}