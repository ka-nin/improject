const express = require("express")
const router = express.Router()
const { ResidentLog } = require("../models")

// GET all residents
router.get("/", async (req, res) => {
  try {
    const residents = await ResidentLog.findAll({
      order: [["createdAt", "DESC"]],
    })
    console.log("✅ Fetched residents:", residents.length)
    res.json(residents)
  } catch (error) {
    console.error("❌ Error fetching residents:", error)
    res.status(500).json({
      error: "Failed to fetch residents",
      details: error.message,
    })
  }
})

// GET resident by ID
router.get("/:id", async (req, res) => {
  try {
    const resident = await ResidentLog.findByPk(req.params.id)

    if (!resident) {
      return res.status(404).json({ error: "Resident not found" })
    }

    res.json(resident)
  } catch (error) {
    console.error("❌ Error fetching resident:", error)
    res.status(500).json({
      error: "Failed to fetch resident",
      details: error.message,
    })
  }
})

// POST - Create new resident
router.post("/", async (req, res) => {
  try {
    console.log("🔍 Creating resident with data:", req.body)

    const resident = await ResidentLog.create(req.body)
    console.log("✅ Created resident:", resident.residentid)

    res.status(201).json(resident)
  } catch (error) {
    console.error("❌ Error creating resident:", error)
    res.status(400).json({
      error: "Failed to create resident",
      details: error.message,
    })
  }
})

// PUT - Update resident
router.put("/:id", async (req, res) => {
  try {
    console.log("🔍 Updating resident:", req.params.id, "with data:", req.body)

    const [updated] = await ResidentLog.update(req.body, {
      where: { residentid: req.params.id },
    })

    if (updated) {
      const updatedResident = await ResidentLog.findByPk(req.params.id)
      console.log("✅ Updated resident:", updatedResident.residentid)
      res.json(updatedResident)
    } else {
      res.status(404).json({ error: "Resident not found" })
    }
  } catch (error) {
    console.error("❌ Error updating resident:", error)
    res.status(400).json({
      error: "Failed to update resident",
      details: error.message,
    })
  }
})

// DELETE resident
router.delete("/:id", async (req, res) => {
  try {
    console.log("🔍 Deleting resident:", req.params.id)

    const deleted = await ResidentLog.destroy({
      where: { residentid: req.params.id },
    })

    if (deleted) {
      console.log("✅ Deleted resident:", req.params.id)
      res.json({ message: "Resident deleted successfully" })
    } else {
      res.status(404).json({ error: "Resident not found" })
    }
  } catch (error) {
    console.error("❌ Error deleting resident:", error)
    res.status(400).json({
      error: "Failed to delete resident",
      details: error.message,
    })
  }
})

// GET residents with special status (PWD, Senior, etc.)
router.get("/status/:type", async (req, res) => {
  try {
    const { type } = req.params
    let whereClause = {}

    switch (type.toLowerCase()) {
      case "pwd":
        // FIXED: Changed from isPWD to ispwd to match your model
        whereClause = { ispwd: true }
        break
      case "senior":
        // FIXED: Changed from isSenior to issenior to match your model
        whereClause = { issenior: true }
        break
      case "active":
        whereClause = { isActive: true }
        break
      case "inactive":
        whereClause = { isActive: false }
        break
      default:
        return res.status(400).json({ error: "Invalid status type" })
    }

    const residents = await ResidentLog.findAll({
      where: whereClause,
      order: [["name", "ASC"]],
    })

    res.json(residents)
  } catch (error) {
    console.error("❌ Error fetching residents by status:", error)
    res.status(500).json({
      error: "Failed to fetch residents by status",
      details: error.message,
    })
  }
})

module.exports = router
