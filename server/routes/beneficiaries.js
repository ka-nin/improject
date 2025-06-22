const express = require("express")
const router = express.Router()
const { ProgramBeneficiaries, ResidentLog, Program } = require("../models")

// GET all beneficiaries with program and resident details
router.get("/", async (req, res) => {
  try {
    const beneficiaries = await ProgramBeneficiaries.findAll({
      include: [
        {
          model: Program,
          as: "program",
          attributes: ["programid", "name", "programtype"],
        },
        {
          model: ResidentLog,
          as: "resident",
          attributes: ["residentid", "name", "address", "contact"],
        },
      ],
      order: [["datejoined", "DESC"]],
    })
    res.json(beneficiaries)
  } catch (error) {
    console.error("Error fetching beneficiaries:", error)
    res.status(500).json({ error: error.message })
  }
})

// GET beneficiaries by program ID
router.get("/program/:programId", async (req, res) => {
  try {
    const beneficiaries = await ProgramBeneficiaries.findAll({
      where: { programid: req.params.programId },
      include: [
        {
          model: ResidentLog,
          as: "resident",
          attributes: ["residentid", "name", "address", "contact", "age", "isPWD", "isSenior"],
        },
      ],
      order: [["datejoined", "DESC"]],
    })
    res.json(beneficiaries)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET beneficiaries by resident ID
router.get("/resident/:residentId", async (req, res) => {
  try {
    const beneficiaries = await ProgramBeneficiaries.findAll({
      where: { residentid: req.params.residentId },
      include: [
        {
          model: Program,
          as: "program",
          attributes: ["programid", "name", "programtype", "datestart"],
        },
      ],
      order: [["datejoined", "DESC"]],
    })
    res.json(beneficiaries)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST - Add new beneficiary
router.post("/", async (req, res) => {
  try {
    const beneficiary = await ProgramBeneficiaries.create(req.body)
    res.status(201).json(beneficiary)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// PUT - Update beneficiary
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await ProgramBeneficiaries.update(req.body, {
      where: { benefitid: req.params.id },
    })
    if (updated) {
      const updatedBeneficiary = await ProgramBeneficiaries.findByPk(req.params.id)
      res.json(updatedBeneficiary)
    } else {
      res.status(404).json({ error: "Beneficiary not found" })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// DELETE beneficiary
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ProgramBeneficiaries.destroy({
      where: { benefitid: req.params.id },
    })
    if (deleted) {
      res.json({ message: "Beneficiary record deleted successfully" })
    } else {
      res.status(404).json({ error: "Beneficiary not found" })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
