const express = require("express")
const router = express.Router()



const { auth, isLibrarian } = require("../middleware/auth")
const { addbook, allbooks, issue, createRequest, reviewRequest, approveRequest, oneBook, oneBookByCreatedId } = require("../controllers/book")

router.post("/add", addbook)
router.get("/all", allbooks)
router.get("/one/:bookId", oneBook)
router.get("/oneid/:uni", oneBookByCreatedId)
// router.post("/issue", auth, isLibrarian, issue)
router.post("/createRequest/:userId/:bookId", createRequest)
router.get("/requests",  reviewRequest)
router.put("/approveRequest/:userId/:bookId",  approveRequest)

module.exports = router
