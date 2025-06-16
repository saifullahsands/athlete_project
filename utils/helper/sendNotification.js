
// const prisma=require("../../lib/prismaClient")
// const {sendMessage }=require("./sendMessage")
// const sendNotification=async()=>{
//   try {
//       const UserDevices=await prisma.devices.findMany({
//           where:{
//               userId:req.user.id
//           },
//           select:{
//               fcmToken:true
//           }
//       })
//       if(UserDevices.length){
//           await Promise.all(UserDevices.map(async (item)=>{
//               if(item.fcmToken){
//                   await sendMessage(fcmToken,"title","message")
//               }
//           }))
//       }
//       await prisma.notifications.create({
//           data:{
//               userId,
//               message:"OK",
//               title:"New Message ",
//               meta:JSON.stringify({
//                   messageId: "dsdas",
//             userId: "dskndksndk",
//               })
//           }
//       })
//   } catch (error) {
//     console.log("errorr in sned Notifications :: ",error.message)
//   }
// }
