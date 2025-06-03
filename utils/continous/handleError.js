 

 function okResponse(res,status,message,data=null,token=null){
    const response={
        success:true,
        status,
        message,
        data,
        token
    }
    return res.status(status).json(response)
 }

 function Errorhandler(res,status,message,data=null){
    const response={
        success:false,
        status,
        message,
        data
    }
    return res.status(status).json(response)
 }

 function BadRequestError(res,message="BadRequest Error"){
   const response={
      success:false,
      status:400,
      message
   }
   return res.status(response.status).json(response)
 }

 function unAuthorized(res,message="user is unAuthorized"){
   const response={
      success:false,
      status:401,
      message
   }
   return res.status(response.status).json(response)
 }
 module.exports={
    Errorhandler,
    okResponse,
    BadRequestError,
    unAuthorized
 }