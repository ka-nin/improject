module.exports = (sequelize, DataTypes) => {
  const Program = sequelize.define(
    "Program",
    {
      programid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      projid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Foreign key to Projects table",
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      datestart: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "Planning",
      },
      completiondate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      programtype: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "Type of program (Health, Education, Social Services, etc.)",
      },
    },
    {
      timestamps: true,
      tableName: "Programs",
      hooks: {
        beforeCreate: (program) => {
          if (!program.programtype) {
            program.programtype = "General"
          }
        },
      },
    },
  )

  // Define associations
  Program.associate = (models) => {
    // Program belongs to Project (optional)
    Program.belongsTo(models.Project, {
      foreignKey: "projid",
      as: "project",
      allowNull: true,
    })

    // Program has many beneficiaries
    Program.hasMany(models.ProgramBeneficiaries, {
      foreignKey: "programid",
      as: "beneficiaries",
    })
  }

  return Program
}
