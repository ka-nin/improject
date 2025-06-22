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
        comment: "Foreign key to Programs table",
      },
      residentid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ResidentLog",
          key: "residentid",
        },
        comment: "Foreign key to ResidentLog table",
      },
      datejoined: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: "Date when resident joined/received benefit",
      },
      benefittype: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "Type of benefit received (e.g., 'Food Package', 'Medical Aid', 'Educational Support')",
      },
      benefitReceived: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Detailed description of what benefit was received",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        comment: "Quantity of benefit received",
      },
      status: {
        type: DataTypes.ENUM("Pending", "Approved", "Distributed", "Completed", "Cancelled"),
        allowNull: false,
        defaultValue: "Pending",
        comment: "Status of the benefit distribution",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Additional notes about the benefit",
      },
      distributedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "Name of person who distributed the benefit",
      },
      distributionDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "Actual date when benefit was distributed",
      },
    },
    {
      timestamps: true,
      tableName: "ProgramBeneficiaries",
      indexes: [
        {
          unique: false,
          fields: ["programid"],
        },
        {
          unique: false,
          fields: ["residentid"],
        },
        {
          unique: false,
          fields: ["datejoined"],
        },
        {
          unique: false,
          fields: ["status"],
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
