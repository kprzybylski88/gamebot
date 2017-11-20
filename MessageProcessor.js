const EventEmmiter = require('events');
class MessageProcessor extends EventEmmiter {
	constructor() {
		super();
		this.processMessage = function(destination,author,message) {
			this.emit(destination,author,message);
		}
		this.respond = function(responder,respondee,message) {
			this.emit("response",responder,respondee,message);
		}
	}
}
module.exports = MessageProcessor;