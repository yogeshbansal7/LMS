const express = require("express")
const router = express.Router()



const { auth, isLibrarian } = require("../middleware/auth")
const { addbook, allbooks, issue, createRequest, reviewRequest, approveRequest, oneBook, oneBookByCreatedId, rejectRequest, submitBook } = require("../controllers/book")

router.post("/add", addbook)
router.get("/all", allbooks)
router.get("/one/:bookId", oneBook)
router.get("/oneid/:uni", oneBookByCreatedId)
// router.post("/issue", auth, isLibrarian, issue)
router.post("/createRequest/:userId/:bookId", createRequest)
router.get("/requests",  reviewRequest)
router.patch("/approveRequest/:userId/:bookId",  approveRequest)
router.patch("/rejectRequest/:userId/:bookId",  rejectRequest)
router.patch("/submitRequest/:userId/:bookId",  submitBook)


module.exports = router
