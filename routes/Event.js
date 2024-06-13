const express = require("express")
const { addevent, allevent } = require("../controllers/event")
const router = express.Router()


router.get("/", allevent)
router.post("/add", addevent)




module.exports = router
