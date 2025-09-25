// class ExpressError extends Error {
//     constructor(statusCode, message) {
//         super();
//         this.statusCode = statusCode;
//         this.message = message;
//     }
// }

class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message);           // ✅ pass message to Error constructor
        this.statusCode = statusCode;
        this.name = "ExpressError"; // (optional, makes stack traces clearer)
    }
}

module.exports = ExpressError;
