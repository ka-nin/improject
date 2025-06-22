require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const app = express()

const db = require("./models")
const { sequelize } = db

// Middleware
app.use(cors())
app.use(express.json())

// Routers
const programRouter = require("./routes/programs")
const projectRouter = require("./routes/project")
const residentLogRouter = require("./routes/residentlog")
const beneficiariesRouter = require("./routes/beneficiaries")

// Health check route (optional)
app.get("/", (req, res) => {
  res.send("Barangay 176 Backend API is running ✅")
})

// Register routes
app.use("/programs", programRouter)
app.use("/projects", projectRouter)
app.use("/residentlog", residentLogRouter)
app.use("/residents", residentLogRouter) // Alternative endpoint for residents
app.use("/beneficiaries", beneficiariesRouter)

// DB connection
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to Supabase PostgreSQL")
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message)
  })

// Sync and run server
sequelize
  .sync({ force: false }) // 👈 safer for dev & prod
  .then(() => {
    console.log("✅ DB Synced")
    app.listen(3001, () => {
      console.log("🚀 Server is running at http://localhost:3001")
      console.log("📋 Available endpoints:")
      console.log("  - GET  /programs")
      console.log("  - GET  /projects")
      console.log("  - GET  /residentlog")
      console.log("  - GET  /residents")
      console.log("  - GET  /beneficiaries")
    })
  })
