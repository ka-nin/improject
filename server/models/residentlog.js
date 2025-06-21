module.exports = (sequelize, DataTypes) => {
  const ResidentLog = sequelize.define(
    "ResidentLog",
    {
      residentid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      contact: {
        type: DataTypes.STRING(12),
        allowNull: true,
      },
      ispwd: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Is Person with Disability",
      },
      issenior: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Is Senior Citizen",
      },
      civilstatus: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      residenttype: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "Type of resident (Regular, PWD, Senior, etc.)",
      },
    },
    {
      timestamps: true,
      tableName: "ResidentLog",
    },
  )

  // Define associations
  ResidentLog.associate = (models) => {
    // Resident has many program beneficiaries
    ResidentLog.hasMany(models.ProgramBeneficiaries, {
      foreignKey: "residentid",
      as: "programBeneficiaries",
    })
  }

  return ResidentLog
}
