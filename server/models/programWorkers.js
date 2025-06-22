module.exports = (sequelize, DataTypes) => {
  const ProgramWorkers = sequelize.define(
    "ProgramWorkers",
    {
      workerid: {
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
      role: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "Role in the program (e.g., 'Coordinator', 'Volunteer', 'Assistant')",
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      responsibilities: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "ProgramWorkers",
    },
  )

  ProgramWorkers.associate = (models) => {
    ProgramWorkers.belongsTo(models.Program, {
      foreignKey: "programid",
      as: "program",
    })

    ProgramWorkers.belongsTo(models.ResidentLog, {
      foreignKey: "residentid",
      as: "worker",
    })
  }

  return ProgramWorkers
}
