/**
 * takes a message and http code to construct a http response message
 */
class HttpError extends Error {
	constructor(message, errorCode) {
		super(message); // Add a "message" property
		this.code = errorCode; // Adds a "code" property
	}
}
  
module.exports = HttpError;