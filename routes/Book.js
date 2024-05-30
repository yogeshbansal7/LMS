const express = require("express")
const router = express.Router()



const { auth, isLibrarian } = require("../middleware/auth")
const { addbook, allbooks, issue, createRequest, reviewRequest, approveRequest } = require("../controllers/book")

router.post("/add", auth, isLibrarian, addbook)
router.get("/all", allbooks)
// router.post("/issue", auth, isLibrarian, issue)
router.post("/createRequest", createRequest)
router.get("/requests", auth, isLibrarian, reviewRequest)
router.post("/approveRequest", auth , isLibrarian, approveRequest)

module.exports = router
