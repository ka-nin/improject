require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./models');
const { sequelize } = db;

app.use(cors());
app.use(express.json());

// ROUTES
const programRouter = require('./routes/programs');
const projectRouter = require('./routes/project');
const residentLogRouter = require('./routes/residentlog');

app.use('/programs', programRouter);
app.use('/projects', projectRouter);
app.use('/residentlog', residentLogRouter);


// DATABASE CONNECTION
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to Supabase PostgreSQL database successfully!');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// SYNC MODELS
sequelize.sync().then(() => {
  console.log("Safe sync: No changes made to existing tables.");

  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
