const express = require("express")
const { check, createLibrary, detail } = require("../controllers/library")
const router = express.Router()



router.post("/libraryaction", check)
router.post("/librarycreate", createLibrary)
router.get("/detail", detail)
// router.get("/vacantseats", addbook)

module.exports = router
