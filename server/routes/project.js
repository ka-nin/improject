const express = require('express');
const router = express.Router();
const db = require('../models');
const Projects = db.projects;

// Create
router.post('/', async (req, res) => {
  try {
    const newProject = await Projects.create(req.body);
    res.json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const allProjects = await Projects.findAll();
    res.json(allProjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const project = await Projects.findByPk(req.params.id);
    if (project) res.json(project);
    else res.status(404).json({ error: 'Project not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const updated = await Projects.update(req.body, {
      where: { projid: req.params.id }
    });
    res.json({ message: 'Updated successfully', updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Projects.destroy({ where: { projid: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
