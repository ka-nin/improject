module.exports = (sequelize, DataTypes) => {
  const ProgramBeneficiaries = sequelize.define(
    "ProgramBeneficiaries",
    {
      beneficiaryid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      programid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Foreign key to Programs table",
      },
      residentid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Foreign key to ResidentLog table",
      },
      datejoined: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      benefittype: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "Type of benefit received",
      },
      benefitreceived: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Description of benefit received",
      },
    },
    {
      timestamps: true,
      tableName: "ProgramBeneficiaries",
    },
  )

  // Define associations
  ProgramBeneficiaries.associate = (models) => {
    // Beneficiary belongs to Program
    ProgramBeneficiaries.belongsTo(models.Program, {
      foreignKey: "programid",
      as: "program",
    })

    // Beneficiary belongs to Resident
    ProgramBeneficiaries.belongsTo(models.ResidentLog, {
      foreignKey: "residentid",
      as: "resident",
    })
  }

  return ProgramBeneficiaries
}
