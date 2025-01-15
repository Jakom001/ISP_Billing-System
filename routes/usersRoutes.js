const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const isAuthenticated = require("../middlewares/authenticateUser");

router.get("/all-users",isAuthenticated, userController.getUsers);

router.post('/add-user', userController.addUser)

router.put('/update-user/:id', userController.updateUser)

router.delete('/delete-user/:id', userController.deleteUser)

router.get('/single-user/:id', userController.getUserById)


module.exports = router