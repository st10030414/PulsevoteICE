const express = require("express");
const { createPoll, getPolls, votePoll } = require("../controllers/pollController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", getPolls);
router.post("/", protect, createPoll);
router.post("/vote", protect, votePoll);


module.exports = router;
