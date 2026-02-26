const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number,
    image: { type: String, default: "" },
    driveLink: String,

    professional: String,  // 👈 First / Second / Third Part 1 / Third Part 2
    subject: {
        type: String,
        default: null      // 👈 Subject optional
    },

    isApproved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Book", bookSchema);
