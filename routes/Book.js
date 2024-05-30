const express = require("express")
const router = express.Router()



const { auth, isLibrarian } = require("../middleware/auth")
const { addbook, allbooks, issue } = require("../controllers/book")

router.post("/add", auth, isLibrarian, addbook)
router.get("/all", allbooks)
router.post("/issue", auth, isLibrarian, issue)

module.exports = router
