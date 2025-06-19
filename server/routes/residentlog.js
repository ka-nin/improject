const express = require('express');
const router = express.Router();
const db = require('../models'); // Adjust path as needed
const ResidentLog = db.residentlog;

// CREATE a new resident
router.post('/', async (req, res) => {
  try {
    const resident = await ResidentLog.create(req.body);
    res.status(201).json(resident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all residents
router.get('/', async (req, res) => {
  try {
    const residents = await ResidentLog.findAll();
    res.json(residents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ one resident by ID
router.get('/:id', async (req, res) => {
  try {
    const resident = await ResidentLog.findByPk(req.params.id);
    if (resident) res.json(resident);
    else res.status(404).json({ message: 'Resident not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE resident by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await ResidentLog.update(req.body, {
      where: { residentid: req.params.id }
    });
    res.json({ message: 'Updated', affectedRows: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE resident by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ResidentLog.destroy({
      where: { residentid: req.params.id }
    });
    res.json({ message: 'Deleted', affectedRows: deleted });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
