class GenericResponse {
    constructor(status, message, flag, data){
     this.status = status;
     this.message = message;
     this.isSuccessFul = flag;
     this.data = data;
    }
}

module.exports ={
    GenericResponse,
} 