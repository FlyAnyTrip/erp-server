const express = require("express")
const GoogleSheet = require("../models/GoogleSheet")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// Get all sheets for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.admin.id || req.admin._id
    const sheets = await GoogleSheet.find({ userId }).sort({ isPinned: -1, createdAt: -1 })
    res.json(sheets)
  } catch (error) {
    console.error("Error fetching sheets:", error)
    res.status(500).json({ message: "Failed to fetch sheets", error: error.message })
  }
})

// Get pinned sheets
router.get("/pinned", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.admin.id || req.admin._id
    const pinnedSheets = await GoogleSheet.find({ userId, isPinned: true }).sort({ createdAt: -1 })
    res.json(pinnedSheets)
  } catch (error) {
    console.error("Error fetching pinned sheets:", error)
    res.status(500).json({ message: "Failed to fetch pinned sheets", error: error.message })
  }
})

// Create a new sheet
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, url } = req.body
    const userId = req.user.id || req.admin.id || req.admin._id

    if (!name || !url) {
      return res.status(400).json({ message: "Name and URL are required" })
    }

    // Validate Google Sheets URL
    if (!url.includes("docs.google.com/spreadsheets")) {
      return res.status(400).json({ message: "Invalid Google Sheets URL" })
    }

    const newSheet = new GoogleSheet({
      userId,
      name,
      url,
    })

    await newSheet.save()
    res.status(201).json(newSheet)
  } catch (error) {
    console.error("Error creating sheet:", error)
    res.status(500).json({ message: "Failed to create sheet", error: error.message })
  }
})

// Toggle pin status
router.put("/:id/pin", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.admin.id || req.admin._id
    const sheet = await GoogleSheet.findById(req.params.id)

    if (!sheet) {
      return res.status(404).json({ message: "Sheet not found" })
    }

    if (sheet.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    sheet.isPinned = !sheet.isPinned
    sheet.updatedAt = new Date()
    await sheet.save()

    res.json(sheet)
  } catch (error) {
    console.error("Error updating sheet:", error)
    res.status(500).json({ message: "Failed to update sheet", error: error.message })
  }
})

// Delete a sheet
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.admin.id || req.admin._id
    const sheet = await GoogleSheet.findById(req.params.id)

    if (!sheet) {
      return res.status(404).json({ message: "Sheet not found" })
    }

    if (sheet.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    await GoogleSheet.findByIdAndDelete(req.params.id)
    res.json({ message: "Sheet deleted successfully" })
  } catch (error) {
    console.error("Error deleting sheet:", error)
    res.status(500).json({ message: "Failed to delete sheet", error: error.message })
  }
})

module.exports = router
