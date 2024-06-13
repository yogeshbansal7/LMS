const express = require("express")
const { check } = require("../controllers/library")
const router = express.Router()



router.post("/libraryaction", check)
// router.post("/checkout", addbook)
// router.get("/vacantseats", addbook)

module.exports = router
