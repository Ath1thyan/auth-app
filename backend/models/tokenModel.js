const mongoose = require("mongoose")

const tokenSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    token: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        required: true
    }
})

const Token = mongoose.model("Token", tokenSchema)
module.exports = Token