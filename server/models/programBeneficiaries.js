module.exports = (sequelize, DataTypes) => {
  const ProgramBeneficiaries = sequelize.define(
    "ProgramBeneficiaries",
    {
      benefitid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      programid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Programs",
          key: "programid",
        },
      },
      residentid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ResidentLog",
          key: "residentid",
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "Active",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "ProgramBeneficiaries",
      indexes: [
        {
          unique: true,
          fields: ["programid", "residentid"],
          name: "unique_program_resident",
        },
      ],
    },
  )

  // Define associations
  ProgramBeneficiaries.associate = (models) => {
    // Belongs to Program
    ProgramBeneficiaries.belongsTo(models.Program, {
      foreignKey: "programid",
      as: "program",
    })

    // Belongs to Resident
    ProgramBeneficiaries.belongsTo(models.ResidentLog, {
      foreignKey: "residentid",
      as: "resident",
    })
  }

  return ProgramBeneficiaries
}
