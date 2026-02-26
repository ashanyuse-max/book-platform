const express = require("express");
const router = express.Router();
const multer = require("multer");
const Book = require("../models/Book");

// Storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "book") {
            cb(null, "uploads/");
        } else if (file.fieldname === "image") {
            cb(null, "uploads/");
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Upload Book
router.post("/upload", async (req, res) => {
    try {

        let driveLink = req.body.driveLink;

        if (!driveLink) {
            return res.status(400).json({ error: "Drive link is required" });
        }

        // Convert Google Drive link automatically
        const match = driveLink.match(/\/d\/(.*?)\//);
        if (match && match[1]) {
            const fileId = match[1];
            driveLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }

        const newBook = new Book({
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            image: req.body.image || "",   // 👈 if empty, save blank
            driveLink: driveLink
        });

        await newBook.save();

        res.json({ message: "Book submitted for approval" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get Approved Books (Public)
router.get("/approved", async (req, res) => {
    try {
        const books = await Book.find({ isApproved: true });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Books (Admin)
router.get("/all", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve Book
router.put("/approve/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { returnDocument: 'after' }
        );

        res.json({ message: "Book approved successfully", book: updatedBook });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Book
router.delete("/delete/:id", async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/approved", async (req, res) => {
    try {
        const books = await Book.find({ isApproved: true });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
