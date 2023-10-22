class CustomAPIErrorHandler extends Error {
    constructor(public StatusCode: number, public message: string){
        super(message)
    }
}

export default {CustomAPIErrorHandler}