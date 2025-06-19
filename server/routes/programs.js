const express = require('express');
const router = express.Router();
const db = require('../models');
const Programs = db.programs;

// Create
router.post('/', async (req, res) => {
  try {
    const newProgram = await Programs.create(req.body);
    res.json(newProgram);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const allPrograms = await Programs.findAll();
    res.json(allPrograms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const program = await Programs.findByPk(req.params.id);
    if (program) res.json(program);
    else res.status(404).json({ error: 'Program not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const updated = await Programs.update(req.body, {
      where: { programid: req.params.id }
    });
    res.json({ message: 'Updated successfully', updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Programs.destroy({ where: { programid: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
