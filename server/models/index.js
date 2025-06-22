const { Sequelize } = require("sequelize")
const sequelize = new Sequelize("postgres", "postgres.ymvivefetgltqbfogwxm", "NpPUI9UiWfm8gqCQ", {
  host: "aws-0-ap-southeast-1.pooler.supabase.com",
  dialect: "postgres",
  port: 5432,
  logging: console.log, // Enable SQL logging for debugging
})

const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize

// Load ALL your models - THIS WAS THE MISSING PART!
db.Program = require("./programs")(sequelize, Sequelize.DataTypes)
db.Project = require("./project")(sequelize, Sequelize.DataTypes)
db.ResidentLog = require("./residentlog")(sequelize, Sequelize.DataTypes)
db.ProgramBeneficiaries = require("./programBeneficiaries")(sequelize, Sequelize.DataTypes)
db.ProgramItems = require("./programItems")(sequelize, Sequelize.DataTypes)

// Set up associations AFTER all models are loaded
console.log("🔗 Setting up model associations...")

// Program associations
if (db.Program.associate) {
  db.Program.associate(db)
}

// Project associations
if (db.Project.associate) {
  db.Project.associate(db)
}

// ResidentLog associations
if (db.ResidentLog.associate) {
  db.ResidentLog.associate(db)
}

// ProgramBeneficiaries associations
if (db.ProgramBeneficiaries.associate) {
  db.ProgramBeneficiaries.associate(db)
}

// ProgramItems associations
if (db.ProgramItems.associate) {
  db.ProgramItems.associate(db)
}

console.log("✅ All models and associations loaded successfully")
console.log(
  "📊 Available models:",
  Object.keys(db).filter((key) => key !== "sequelize" && key !== "Sequelize"),
)

module.exports = db
