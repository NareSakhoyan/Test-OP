class CustomError extends Error{
    constructor(category = "error", status, message) {
        super()
        this.category = category; 
        this.status = status;
        this.message = message;

        throw Error(`${category}, accured. Status Code: ${status}. ${message}`)
    }
}

module.exports.CustomError = CustomError
