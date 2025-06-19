const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  'postgres',
  'postgres.ymvivefetgltqbfogwxm',
  'NpPUI9UiWfm8gqCQ',
  {
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    dialect: 'postgres',
    port: 5432,
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Load your models
db.Program = require('./programs')(sequelize, Sequelize.DataTypes);
db.Project = require('./project')(sequelize, Sequelize.DataTypes);
db.ResidentLog = require('./residentlog')(sequelize, Sequelize.DataTypes);

module.exports = db;
