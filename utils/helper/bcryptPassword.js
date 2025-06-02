const bcrypt=require("bcrypt");

const HashingPassword=async(password)=>{
    const salt=await bcrypt.genSalt(10)
    const hashPassword=await bcrypt.hash(password,salt)
    return hashPassword
}

const ComparePassword=async(password,userPassword)=>{
    return await bcrypt.compare(password,userPassword)
}

module.exports={
    HashingPassword,
    ComparePassword
}