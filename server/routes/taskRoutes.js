const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { protect } = require("../middleware/authMiddleware");

// GET all tasks for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE task
router.post("/", protect, async (req, res) => {
  if (!req.body.title) return res.status(400).json({ message: "Title is required" });

  try {
    const newTask = new Task({ title: req.body.title, user: req.user._id });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE task
router.put("/:id", protect, async (req, res) => {
  const { title, completed } = req.body;
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE task
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;