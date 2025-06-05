
const {validationError }=require("../utils/index")


const validateSchema=(schema)=>{
    return(req,res,next)=>{
        try {
            const {query,params,body}=req
        const {error}=schema.validate({query,params,body},{abortEarly:false,convert: true})
        if(error){
            const errMessage=error.details.map((err)=>err.message)
            return validationError(res,errMessage)
        }  
        next()
        } catch (error) {
            console.log("error in validation :: ",error)
            next(error)
        }
        
    }
}

module.exports={validateSchema}