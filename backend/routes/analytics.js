const express = require("express");
const Submission = require("../models/Submission");

const router = express.Router();

// Get all submissions
router.get("/all", async (req, res) => {
    try {
        const submissions = await Submission.find();
        res.status(200).json(submissions);
    } catch (err) {
        console.error("Error fetching submissions:", err);
        res.status(500).json({ message: "Error fetching submissions." });
    }
});

module.exports = router;
