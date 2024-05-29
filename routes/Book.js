const express = require("express")
const router = express.Router()

const {
  login,
  signup,
  sendotp,
  changePassword, 
} = require("../controllers/Auth")
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword")

const { auth, isLibrarian } = require("../middleware/auth")
const { addbook } = require("../controllers/book")

router.post("/add", auth, isLibrarian, addbook)

module.exports = router
