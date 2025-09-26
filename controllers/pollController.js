const Poll = require("../models/Poll");

exports.createPoll = async (req, res) => {
  const { question, options } = req.body;
  try {
    const poll = await Poll.create({
      question,
      options: options.map(text => ({ text })),
      createdBy: req.user.id
    });
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.votePoll = async (req, res) => {
  const { pollId, optionIndex } = req.body;
  try {
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });
    if (optionIndex < 0 || optionIndex >= poll.options.length)
      return res.status(400).json({ message: "Invalid option" });

    poll.options[optionIndex].votes += 1;
    await poll.save();
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.votePoll = async (req, res) => {
  const { pollId, optionIndex } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: "Login required to vote" });

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (poll.votedBy.includes(userId)) {
      return res.status(400).json({ message: "You have already voted" });
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length)
      return res.status(400).json({ message: "Invalid option" });

    poll.options[optionIndex].votes += 1;
    poll.votedBy.push(userId);

    await poll.save();
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
