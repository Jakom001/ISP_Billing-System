const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

router.get("all-users", userController.getUsers);

module.exports = router