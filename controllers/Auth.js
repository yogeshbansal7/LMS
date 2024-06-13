const bcrypt = require("bcrypt")
const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
require("dotenv").config()


exports.getDetailOfUser = async(req, res) => {
  const { id } = req.params;
  console.log(req.params);
  console.log("Fetching detail of user with user id", id);

  try {
    // const user = await User.findById(id).populate('issuedBooks.book')
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user)
    res.status(200).json( user );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

exports.signup = async (req, res) => {

  console.log("entering in signup api")
  console.log(req.body)



  try {
    const {
      name,
      email,
      password,
      otp,
      actType
    } = req.body
    if (
      !name ||
      !email ||
      !password 
      // !otp
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      })
    }

    if(actType == "Librarian"){
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        accountType: actType,
      })

      console.log("Librarian added succesfully")
      console.log(user)

      await mailSender(
        email,
        `Account Created`,
        paymentSuccessEmail(
          name,
          email,
          password
          // `${email} ${password}`,
          // amount / 100,
          // orderId,
          // paymentId
        )
      )

      return res.status(200).json({
        success: true,
        user,
        message: "User registered successfully",
      })
  
    }



    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    console.log(response)
    if (response.length === 0) {
      
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    } else if (parseInt(otp) !== parseInt(response[0].otp)) {


      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })


    }  
    
    

    let approved = ""
    approved === "Librarian" ? (approved = false) : (approved = true)  

    let accountType = "User"

    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      accountType: accountType,
    })


    console.log(user)

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
  }
}

exports.login = async (req, res) => {
  console.log("entered in login pageeee")
  console.log(req.body);

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      })
    }

    

    const user = await User.findOne({ email })
    

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      })
    }

    console.log("234234")

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      )

      user.token = token
      user.password = undefined
      // const options = {
      //   expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      //   httpOnly: true,
      // }
      // res.cookie("token", token, options).status(200).json({
      //   success: true,
      //   token,
      //   user,
      //   message: `User Login Success`,
      // })

      res.status(200).json({
    
        user,
        success: true,
        message: `Login Successfully`,
      })
    }


    else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    })
  }
}

exports.sendotp = async (req, res) => {
  console.log("sending otp")
  console.log(req.body)
  try {
    const { email } = req.body
    console.log(email)
    const checkUserPresent = await User.findOne({ email })

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    var otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    
    const result = await OTP.findOne({ otp: otp })
    console.log("Result is Generate OTP Func")
    console.log("OTP", otp)
    console.log("Result", result)
    while (result) {
      otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
      })
    }
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)
    console.log("OTP Body", otpBody)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })


    console.log("done")
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
}

exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id)

    const { oldPassword, newPassword } = req.body

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
} 

exports.userfind = async (req, res) => {
  console.log("entering in user find...");


    try {
      const userId = req.params.id;
  
      // Find the user by MongoDB _id
      const user = await User.findById(userId);
  
      // If user found, return user's issued books
      if (user) {
        console.log(user.issuedBooks);
        return res.json(user.issuedBooks); 
      } else {
        return res.status(404).json({ message: 'User not found' }); 
      }
    } catch (error) {
      console.error("Error in userfind:", error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
}