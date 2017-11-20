module.exports = Processor;
function Processor() {
	this.commands = {};
	this.respond = function(message) {
		if (message == "ping") {
			return "pong";
		}
		return "nonprocessable";
	}
}