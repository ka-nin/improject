const express = require("express")
const router = express.Router()
const { ProgramBeneficiaries, ResidentLog } = require("../models")

// Test route to verify the route is working
router.get("/test", (req, res) => {
  res.json({
    message: "✅ Beneficiaries route is working!",
    timestamp: new Date().toISOString(),
  })
})

// GET beneficiaries by program ID
router.get("/program/:programId", async (req, res) => {
  try {
    const { programId } = req.params
    console.log("🔍 Fetching beneficiaries for program:", programId)

    // Validate programId
    if (!programId || isNaN(programId)) {
      return res.status(400).json({ error: "Invalid program ID" })
    }

    // Check if models are properly loaded
    if (!ProgramBeneficiaries || !ResidentLog) {
      console.error("❌ Models not properly loaded")
      return res.status(500).json({ error: "Database models not available" })
    }

    // Fetch beneficiaries with resident data
    const beneficiaries = await ProgramBeneficiaries.findAll({
      where: {
        programid: parseInt(programId),
        isActive: true,
      },
      include: [
        {
          model: ResidentLog,
          as: "resident",
          attributes: ["residentid", "name", "address", "contact", "age", "ispwd", "issenior", "gender", "isActive"],
          required: true, // Inner join to ensure resident exists
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    console.log(`✅ Found ${beneficiaries.length} beneficiaries for program ${programId}`)
    res.json(beneficiaries)
  } catch (error) {
    console.error("❌ Error fetching beneficiaries:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    res.status(500).json({
      error: "Failed to fetch beneficiaries",
      details: error.message,
    })
  }
})

// POST - Add new beneficiary
router.post("/", async (req, res) => {
  try {
    console.log("🔍 Adding beneficiary:", req.body)

    // Validate required fields
    const { programid, residentid } = req.body
    if (!programid || !residentid) {
      return res.status(400).json({ error: "programid and residentid are required" })
    }

    // Validate that IDs are numbers
    if (isNaN(programid) || isNaN(residentid)) {
      return res.status(400).json({ error: "programid and residentid must be valid numbers" })
    }

    // Check if resident exists and is active
    const resident = await ResidentLog.findByPk(parseInt(residentid))
    if (!resident) {
      return res.status(404).json({ error: "Resident not found" })
    }

    if (!resident.isActive) {
      return res.status(400).json({ error: "Cannot add inactive resident as beneficiary" })
    }

    // Check if already exists as active beneficiary
    const existing = await ProgramBeneficiaries.findOne({
      where: {
        programid: parseInt(programid),
        residentid: parseInt(residentid),
        isActive: true,
      },
    })

    if (existing) {
      return res.status(400).json({ error: "Resident is already an active beneficiary of this program" })
    }

    // Create new beneficiary
    const beneficiary = await ProgramBeneficiaries.create({
      programid: parseInt(programid),
      residentid: parseInt(residentid),
      date: req.body.date || new Date().toISOString().split("T")[0],
      isActive: true,
      status: req.body.status || "Active",
      notes: req.body.notes || null,
    })

    console.log("✅ Beneficiary added successfully:", beneficiary.benefitid)

    // Return the beneficiary with resident data
    const newBeneficiary = await ProgramBeneficiaries.findByPk(beneficiary.benefitid, {
      include: [
        {
          model: ResidentLog,
          as: "resident",
          attributes: ["residentid", "name", "address", "contact", "age", "ispwd", "issenior", "gender"],
        },
      ],
    })

    res.status(201).json(newBeneficiary)
  } catch (error) {
    console.error("❌ Error adding beneficiary:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    // Handle specific Sequelize errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: "Resident is already a beneficiary of this program",
        details: "Duplicate entry detected"
      })
    }
    
    res.status(400).json({
      error: "Failed to add beneficiary",
      details: error.message,
    })
  }
})

// DELETE beneficiary (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    console.log("🔍 Removing beneficiary:", req.params.id)

    const benefitId = parseInt(req.params.id)
    if (isNaN(benefitId)) {
      return res.status(400).json({ error: "Invalid beneficiary ID" })
    }

    const [updated] = await ProgramBeneficiaries.update(
      { isActive: false }, 
      { where: { benefitid: benefitId } }
    )

    if (updated) {
      console.log("✅ Beneficiary removed successfully")
      res.json({ message: "Beneficiary removed successfully" })
    } else {
      res.status(404).json({ error: "Beneficiary not found" })
    }
  } catch (error) {
    console.error("❌ Error removing beneficiary:", error)
    res.status(400).json({
      error: "Failed to remove beneficiary",
      details: error.message,
    })
  }
})

module.exports = router