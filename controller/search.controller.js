const { searchFilter } = require("../services/search.services")
const { okResponse } = require("../utils")

const searchingAthelete=async(req,res,next)=>{
    try {
        const searchResult=await searchFilter(req)
        okResponse(res,200,"",searchResult)
    } catch (error) {
        console.log(`error in searching Athelete :; ${error.message}`)
        next(error)
    }
}

module.exports={
    searchingAthelete
}