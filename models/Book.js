const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number,
    image: {
        type: String,
        default: ""   // 👈 optional
    },
    driveLink: String,
    
    semester: String,
    subject: String,


    isApproved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Book", bookSchema);