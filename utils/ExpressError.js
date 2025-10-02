// class ExpressError extends Error {
//     constructor(statusCode, message) {
//         super();
//         this.statusCode = statusCode;
//         this.message = message;
//     }
// }

class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message);           
        this.statusCode = statusCode;
        this.name = "ExpressError";
    }
}

module.exports = ExpressError;
