const express = require("express")
const router = express.Router()
const { Project } = require("../models")

// POST - Create new project
router.post("/", async (req, res) => {
  try {
    console.log("🔍 Received project data:", req.body)

    const projectData = {
      ...req.body,
      // Handle type field mapping - prioritize Table field
      Table: req.body.Table || req.body.Type || req.body.projectType || req.body.type,
      type: req.body.type || req.body.Table || req.body.Type,
      projectType: req.body.projectType || req.body.Table || req.body.Type,
    }

    console.log("🔍 Processed project data:", projectData)

    const newProject = await Project.create(projectData)
    console.log("✅ Project created successfully:", newProject.toJSON())

    res.status(201).json(newProject)
  } catch (error) {
    console.error("❌ Project creation failed:", error)
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
})

// GET - Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [["projectid", "DESC"]],
    })

    console.log(`🔍 Found ${projects.length} projects`)

    // Add some debugging info
    if (projects.length > 0) {
      console.log("🔍 Sample project structure:", Object.keys(projects[0].toJSON()))
      console.log("🔍 First project:", projects[0].toJSON())
    }

    res.json(projects)
  } catch (error) {
    console.error("❌ Error fetching projects:", error)
    res.status(500).json({
      error: "Failed to fetch projects",
      details: error.message,
    })
  }
})

// GET single project by ID (for editing)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    console.log("🔍 Fetching project with ID:", id)

    const project = await Project.findOne({
      where: {
        projectid: id,
      },
    })

    if (!project) {
      console.log("❌ Project not found with ID:", id)
      return res.status(404).json({ error: "Project not found" })
    }

    console.log("✅ Project found:", project.toJSON())
    res.json(project)
  } catch (error) {
    console.error("❌ Error fetching project:", error)
    res.status(500).json({
      error: "Failed to fetch project",
      details: error.message,
    })
  }
})

// PUT update project by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const updateData = {
      ...req.body,
      // Handle type field mapping
      Table: req.body.Table || req.body.Type || req.body.projectType || req.body.type,
      type: req.body.type || req.body.Table || req.body.Type,
      projectType: req.body.projectType || req.body.Table || req.body.Type,
    }

    console.log("🔍 Updating project with ID:", id)
    console.log("🔍 Update data:", updateData)

    const [updatedRowsCount] = await Project.update(updateData, {
      where: {
        projectid: id,
      },
    })

    if (updatedRowsCount === 0) {
      console.log("❌ Project not found for update with ID:", id)
      return res.status(404).json({ error: "Project not found" })
    }

    const updatedProject = await Project.findOne({
      where: { projectid: id },
    })

    console.log("✅ Project updated successfully:", updatedProject.toJSON())
    res.json(updatedProject)
  } catch (error) {
    console.error("❌ Error updating project:", error)
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    })
  }
})

// DELETE project by ID - Hard delete (since you don't use soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    console.log("🔍 Deleting project with ID:", id)

    const deletedRowsCount = await Project.destroy({
      where: {
        projectid: id,
      },
    })

    if (deletedRowsCount === 0) {
      console.log("❌ Project not found for deletion with ID:", id)
      return res.status(404).json({ error: "Project not found" })
    }

    console.log("✅ Project deleted successfully")
    res.json({
      message: "Project deleted successfully",
      projectId: id,
      deletedAt: new Date(),
    })
  } catch (error) {
    console.error("❌ Error deleting project:", error)
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    })
  }
})

module.exports = router
