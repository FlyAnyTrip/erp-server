const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// Database Connection
let isDBConnected = false

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected")
    isDBConnected = true
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err)
    isDBConnected = false
  })

app.get("/api/health", (req, res) => {
  const health = {
    status: isDBConnected ? "Server running and DB connected" : "Server running but DB disconnected",
    mongodb: isDBConnected ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }

  const statusCode = isDBConnected ? 200 : 503
  res.status(statusCode).json(health)
})

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/sales", require("./routes/sales"))
app.use("/api/inventory", require("./routes/inventory"))
app.use("/api/expenses", require("./routes/expenses"))
app.use("/api/tasks", require("./routes/tasks"))
app.use("/api/dashboard", require("./routes/dashboard"))
app.use("/api/import", require("./routes/import"))
app.use("/api/sheets", require("./routes/sheets"))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Server error", error: err.message })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
