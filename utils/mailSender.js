const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.MAIL_USER,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occured: " + error);
      } else {
        console.log("successfully sent to :" + to);
      }
    });
    return mailOptions;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = mailSender;

// const nodemailer = require("nodemailer");

// const mailSender = async (email, title, body) => {
//     try{
//             console.log("entered in nodemailer")
//             let transporter = nodemailer.createTransport({
//                 host:process.env.MAIL_HOST,
//                 service: 'gmail',
//                 auth:{
//                     user: process.env.MAIL_USER,
//                     pass: process.env.MAIL_PASS,
//                 }
//             })

//             console.log("above the transporter")
//             let info = await transporter.sendMail({
//                 from: process.env.MAIL_USER,
//                 to:`${email}`,
//                 subject: `${title}`,
//                 html: `${body}`,
//             })
//             console.log("below the transporter")
//             console.log(info);
//             return info;
//     }
//     catch(error) {
//         console.log(error.message);
//     }
// }

// module.exports = mailSender;

// const nodemailer = require("nodemailer")

// const mailSender = async (email, title, body) => {
//   try {
//     console.log("entering in mailsender contriller"); 
//     let transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS, 
//       },
//     })

//     let info = await transporter.sendMail({
//       from: ` ${process.env.MAIL_USER}`,
//       to: `${email}`,
//       subject: `${title}`,
//       html: `${body}`
//     })
//     console.log(info.response)
//     return info
//   } catch (error) {
//     console.log(error.message)
//     return error.message
//   }
// }

// module.exports = mailSender
