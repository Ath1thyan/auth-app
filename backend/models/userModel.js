const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password length must be between 6 to 32 characters"],
        trim: true,
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/, 'Password must contain at least 6 characters, including UPPER/lowercase and numbers'],
        // maxlength: [32, "Password must not exceed 32  characters"]
    },
    photo: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        required: [true, "Please add a image"]
    },
    phone: {
        type: String,
        // required: [true, "Phone number is required"]
        default: "+91",
    },
    role: {
        type: String,
        maxlength: [64, "Must not exceed 64 characters"],
        default: "role"
    }
},  {
    timestamps: true,
});

// Encrypt password before saving to DB
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        return next();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password =  hashedPassword;
})

const User = mongoose.model("User", userSchema)
module.exports = User