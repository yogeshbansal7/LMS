const express = require("express")
const router = express.Router()

const {
  login,
  signup,
  sendotp,
  changePassword, 
  getDetailOfUser,
  userfind
} = require("../controllers/Auth")
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword")

const { auth } = require("../middleware/auth")

router.post("/login", login)
router.get("/user/:id", userfind)
router.post("/signup", signup)
router.post("/sendotp", sendotp)
router.post("/changepassword", auth, changePassword)
router.get("/:id", getDetailOfUser)
router.post("/reset-password-token", resetPasswordToken)
router.post("/reset-password", resetPassword)

module.exports = router
