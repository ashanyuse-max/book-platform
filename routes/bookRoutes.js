const express = require("express");
const router = express.Router();
const multer = require("multer");
const Book = require("../models/Book");


// ================= STORAGE CONFIG =================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });


// ================= UPLOAD BOOK =================
router.post("/upload", upload.fields([
    { name: "book", maxCount: 1 },
    { name: "image", maxCount: 1 }
]), async (req, res) => {

    try {

        let driveLink = req.body.driveLink;

        if (!driveLink) {
            return res.status(400).json({ error: "Drive link is required" });
        }

        // Convert Google Drive link
        const match = driveLink.match(/\/d\/(.*?)\//);
        if (match && match[1]) {
            const fileId = match[1];
            driveLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }

       const newBook = new Book({
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    driveLink: driveLink,

    image: req.files["image"]
        ? req.files["image"][0].filename
        : "",

    semester: req.body.semester,
    subject: req.body.subject
});


        await newBook.save();

        res.json({ message: "Book submitted for approval" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});


// ================= GET APPROVED BOOKS =================
router.get("/approved", async (req, res) => {
    try {
        const books = await Book.find({ isApproved: true });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ================= GET ALL BOOKS (ADMIN) =================
router.get("/all", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ================= APPROVE BOOK =================
router.put("/approve/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { returnDocument: "after" }
        );

        res.json({ message: "Book approved successfully", book: updatedBook });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ================= DELETE BOOK =================
router.delete("/delete/:id", async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;

