const express = require("express")
const router = express.Router()
const { Program, ResidentLog, ProgramBeneficiaries, Project } = require("../models")

// GET - Get all programs (WITHOUT includes to avoid association errors)
router.get("/", async (req, res) => {
  try {
    console.log("🔍 GET /programs - Starting request")
    console.log("🔍 Program model available:", !!Program)

    if (!Program) {
      throw new Error("Program model is not defined")
    }

    // Fetch programs WITHOUT includes first to avoid association errors
    const programs = await Program.findAll({
      order: [["programid", "DESC"]],
      // Remove the include for now to avoid association errors
    })

    console.log(`🔍 Found ${programs.length} programs`)

    if (programs.length > 0) {
      console.log("🔍 First program sample:", {
        programid: programs[0].programid,
        name: programs[0].name,
        programtype: programs[0].programtype,
      })
    }

    res.json(programs)
  } catch (error) {
    console.error("❌ Error fetching programs:", error)
    console.error("❌ Error stack:", error.stack)
    res.status(500).json({
      error: "Failed to fetch programs",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
})

// GET single program by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    console.log("🔍 Fetching program with ID:", id)

    const program = await Program.findOne({
      where: { programid: id },
      // Remove includes for now
    })

    if (!program) {
      console.log("❌ Program not found with ID:", id)
      return res.status(404).json({ error: "Program not found" })
    }

    console.log("✅ Program found:", program.toJSON())
    res.json(program)
  } catch (error) {
    console.error("❌ Error fetching program:", error)
    res.status(500).json({
      error: "Failed to fetch program",
      details: error.message,
    })
  }
})

// POST - Create new program
router.post("/", async (req, res) => {
  try {
    console.log("🔍 Received program data:", req.body)

    const programData = {
      ...req.body,
      programtype: req.body.programtype || req.body.Type || req.body.type || "General",
    }

    console.log("🔍 Processed program data:", programData)

    const newProgram = await Program.create(programData)
    console.log("✅ Program created successfully:", newProgram.toJSON())

    res.status(201).json(newProgram)
  } catch (error) {
    console.error("❌ Program creation failed:", error)
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    })
  }
})

// PUT update program by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const updateData = {
      ...req.body,
      programtype: req.body.programtype || req.body.Type || req.body.type,
    }

    console.log("🔍 Updating program with ID:", id)
    console.log("🔍 Update data:", updateData)

    const [updatedRowsCount] = await Program.update(updateData, {
      where: { programid: id },
    })

    if (updatedRowsCount === 0) {
      console.log("❌ Program not found for update with ID:", id)
      return res.status(404).json({ error: "Program not found" })
    }

    const updatedProgram = await Program.findOne({
      where: { programid: id },
    })

    console.log("✅ Program updated successfully:", updatedProgram.toJSON())
    res.json(updatedProgram)
  } catch (error) {
    console.error("❌ Error updating program:", error)
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    })
  }
})

// DELETE program by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    console.log("🔍 Deleting program with ID:", id)

    const deletedRowsCount = await Program.destroy({
      where: { programid: id },
    })

    if (deletedRowsCount === 0) {
      console.log("❌ Program not found for deletion with ID:", id)
      return res.status(404).json({ error: "Program not found" })
    }

    console.log("✅ Program deleted successfully")
    res.json({
      message: "Program deleted successfully",
      programId: id,
      deletedAt: new Date(),
    })
  } catch (error) {
    console.error("❌ Error deleting program:", error)
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    })
  }
})

// GET program beneficiaries (separate endpoint)
router.get("/:id/beneficiaries", async (req, res) => {
  try {
    const { id } = req.params

    // Simple query without complex includes for now
    const beneficiaries = await ProgramBeneficiaries.findAll({
      where: { programid: id },
      order: [["datejoined", "DESC"]],
    })

    res.json(beneficiaries)
  } catch (error) {
    console.error("❌ Error fetching program beneficiaries:", error)
    res.status(500).json({
      error: "Failed to fetch program beneficiaries",
      details: error.message,
    })
  }
})

// Health check for programs
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    route: "programs",
    timestamp: new Date().toISOString(),
  })
})

module.exports = router
