
const multer=require("multer")

const storage=multer.memoryStorage()

const fileFilter=(req,file,cb)=>{
    const allowType=["image/jpeg","image/jpg","image/png"];
    if(allowType.includes(file.mimetype)){
        console.log("mime typesss  :: ",file.mimetype)
        cb(null,true)
    }
    else{
        cb( new Error("invalid file type Only images are allowed"))
    }
}

const upload=multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fileSize:30 *1024 *1024}
})



module.exports=upload