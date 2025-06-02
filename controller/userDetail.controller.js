const prisma = require("../lib/prismaClient")
const { okResponse } = require("../utils/index")


const fillUserDetails = async (req, res, next) => {
try {
        const userId = req.user?.id
        const { first_name, last_name, DOB, gender, height, address, city, state, phone, emailAddress, education } = req.body
        let user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            }
        })

         const userDetail = await prisma.user_Details.create({
            data: {
                first_name,
                last_name,
                DOB: new Date(DOB),
                gender,
                address,
                city,
                state,
                phone,
                emailAddress,
                userId: parseInt(userId)
            },
          
        })

        const newHeight = await prisma.height.create({
            data: {
                ft: height.ft || null,
                inches: height.inches || null,
                weight: height.weight || null,
                userDetailId: userDetail.userId
            }
        })
    
        const newEducation = await prisma.education.create({
            data: {
                school_name: education.school_name || null,
                GPA: education.GPA || null,
                graduated_year: new Date(education.graduated_year) || null,
                about: education.about || null,
                userDetailId:userDetail.userId
            }
        })
    
       
    const fillUserDetailing=await prisma.user_Details.findFirst({
        where:{
            userId:userDetail.userId
        },
        include:{
            height:true,
            education:true
        }
    })
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                isProfileComplete: true
            }
        })
        okResponse(res, 200, "user details filled successfully", fillUserDetailing)
} catch (error) {
    console.log(`error in fill user details :: ${error.message}`)
    next(error)
}
}


const getUserDetails = async (req, res, next) => {
  try {
      const userId = req.user.id
       const userDetail = await prisma.user.findFirst({
          where: {
              id: parseInt(userId)
          },
          include: {
              user_details:{
                  include:{
                      height:true,
                      education:true
                  }
              },
              
          },
          
      })
      delete userDetail.password
      okResponse(res,200,"get user Details successfully ",userDetail)
  } catch (error) {
    console.log(`error in get user Details :: ${error.message}`)
    next(error)
  }
}


const updateUserDetails=async(req,res,next)=>{
    try {
        const userId=req.user.id
        const { first_name,last_name}=req.body;
        const userDetailing=await prisma.user_Details.update({
            where:{
                userId:parseInt(userId)
            },
            data:{
                last_name:last_name,
                first_name:first_name
            }
        })
        okResponse(res,200,"user updated successfully ",userDetailing)
    } catch (error) {
        console.log("error in update User detailing :: ",error.message)
        next(error)
    }
}
module.exports={
    getUserDetails,
    fillUserDetails,
    updateUserDetails
}