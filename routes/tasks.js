const express = require("express")
const Task = require("../models/Task")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dueDate: 1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message })
  }
})

router.get("/status/:status", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ status: req.params.status }).sort({ dueDate: 1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message })
  }
})

router.get("/pinned/all", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ isPinned: true }).sort({ dueDate: 1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pinned tasks", error: error.message })
  }
})

router.post("/", authMiddleware, async (req, res) => {
  try {
    const task = new Task(req.body)
    await task.save()
    res.status(201).json({ message: "Task created", task })
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error: error.message })
  }
})

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ message: "Task updated", task })
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error: error.message })
  }
})

router.put("/:id/pin", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }
    task.isPinned = !task.isPinned
    await task.save()
    res.json({ message: "Task pin status updated", task })
  } catch (error) {
    res.status(500).json({ message: "Failed to update task pin status", error: error.message })
  }
})

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id)
    res.json({ message: "Task deleted" })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error: error.message })
  }
})

module.exports = router
