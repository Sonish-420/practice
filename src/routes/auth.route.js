const express = require("express")
const router = express.Router()

const authController = require("../controller/auth.controller")
const { rateLimitLogin } = require("../middleware/rateLimiter")

router.post("/login", rateLimitLogin, authController)

module.exports = router
