

const generateOtp=()=>{
const timeStamps=Date.now()
const shortInt=parseInt(timeStamps.toString().slice(-6))
return shortInt
}

module.exports={
    generateOtp
}