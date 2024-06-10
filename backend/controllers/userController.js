const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Register User
const registerUser = asyncHandler( async (req, res) => {
    const {name, email, password} = req.body

    // Validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill all fields")
    }
    if (password.length < 6) {
        res.status(400)
        throw new Error("Password length must be between 6 to 32 characters")
    }

    // Check if user email already exists
    const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400)
        throw new Error("Email already exists")
    }

    // Create new user
    const user = await User.create({
        name,
        email,
        password,
    })

    // Generate Token
    const token = generateToken(user._id)

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true
    })

    if (user) {
        const {_id, name, email, photo, phone, role} = user
        res.status(201).json({
            _id, name, email, photo, phone, role, token,
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid user data")
    }
    
});


// Login User
const loginUser = asyncHandler( async (req, res) => {
    const {email, password} = req.body

    // Validate request
    if (!email ||!password) {
        res.status(400)
        throw new Error("Please fill all fields")
    }

    // Check if user exists
    const user = await User.findOne({email})
    if (!user) {
        res.status(400)
        throw new Error("User not found, Please register")
    }

    // User exists, Check if password is correct
    const passwordCorrect = await bcrypt.compare(password, user.password);

    // Generate Token
    const token = generateToken(user._id)

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true
    })

    if (user && passwordCorrect) {
        const {_id, name, email, photo, phone, role} = user
        res.status(200).json({
            _id, name, email, photo, phone, role, token,
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid email or password")
    }
})

// Logout User
const logout = asyncHandler( async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // immediate
        sameSite: "none",
        secure: true
    })
    return res.status(200).json({
        message: "Logged out successfully"
    })
})


// Get user data
const getUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        const {_id, name, email, photo, phone, role} = user
        res.status(200).json({
            _id, name, email, photo, phone, role,
        })
    }
    else {
        res.status(404)
        throw new Error("User not found")
    }
})


module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
}