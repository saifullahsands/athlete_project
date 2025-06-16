// const fireBaseInstance = require("./firebaseInstance");

// const sendMessage = async (fcmToken, title, message) => {
//   const payload = {
//     notification: {
//       title,
//       vody:message,
//     },
//     token: fcmToken,
//   };

//   try {
//     const response = await fireBaseInstance.messaging().send(payload);
//     console.log("message send successfully :: ", response);
//     return response;
//   } catch (error) {
//     console.log(`error send message :: ${error.message}`);
//   }
// };

// module.exports = {
//   sendMessage,
// };
