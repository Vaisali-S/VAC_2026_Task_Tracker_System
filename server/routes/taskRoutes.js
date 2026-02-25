const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    console.log("Fetched tasks:", tasks);
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
});

// CREATE task
router.post("/", async (req, res) => {
  console.log("POST /api/tasks called with body:", req.body);

  if (!req.body.title) {
    console.warn("Title missing in request body");
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const newTask = new Task({ title: req.body.title });
    const savedTask = await newTask.save();
    console.log("Task saved successfully:", savedTask);
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
});

// UPDATE task
router.put("/:id", async (req, res) => {
  console.log(`PUT /api/tasks/${req.params.id} called with body:`, req.body);
  if (typeof req.body.completed !== "boolean") {
    console.warn("Completed status missing or invalid");
    return res.status(400).json({ message: "Completed status must be boolean" });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    console.log("Task updated successfully:", updatedTask);
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
});

// DELETE task
router.delete("/:id", async (req, res) => {
  console.log(`DELETE /api/tasks/${req.params.id} called`);

  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    console.log("Task deleted successfully:", deletedTask);
    res.json({ message: "Task deleted", task: deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
});

module.exports = router;