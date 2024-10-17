class ApiError extends Error {
    constructor (
        statusCode,
        massage = 'something went Wrong',
        errors = [],
        stack = ''
    ){
        super (massage)
        this.statusCode = statusCode
        this.massage = massage
        this.data = null
        this.success = false
        this.errors = errors
        if (stack) {
            this.stack = stack
        }else{
            Error.captureStackTrace(this , this.constructor)
        }
    }
}

export { ApiError}