const express = require('express');
const { registerUser, loginUser, logout, getUser, loginstatus, updateUser } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();


router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logout)
router.get("/getuser", protect, getUser)
router.get("/loggedin", loginstatus)
router.patch("/updateuser", protect, updateUser)

module.exports = router;