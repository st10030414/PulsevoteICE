const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 },
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});
