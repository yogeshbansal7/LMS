const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const User = require("../models/User")
dotenv.config()

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ success: false, message: `Token Missing` })
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET)
      console.log(decode)
      req.user = decode
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "token is invalid" })
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Something Went Wrong While Validating the Token`,
    })
  }
}
exports.isUser = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email })

    if (userDetails.accountType !== "User") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for User",
      })
    }
    next()
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` })
  }
}
exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email })

    if (userDetails.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Admin",
      })
    }
    next()
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` })
  }
}
exports.isLibrarian = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email })
    console.log(userDetails)

    console.log(userDetails.accountType)

    if (userDetails.accountType !== "Librarian") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Librarian",
      })
    }
    next()
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` })
  }
}