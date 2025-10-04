class Apiresponse{
    constructor(statuscode,message="Success"){
        this.statuscode=statuscode
        this.message=message
        this.success=statuscode<400
        this.data=data
    }
}
export {Apiresponse};