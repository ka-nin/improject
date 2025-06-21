module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
    {
      projectid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      completionDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Planning",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      Table: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Project type/category - maps to frontend Type field",
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Alternative project type field",
      },
      projectType: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Another alternative project type field",
      },
    },
    {
      timestamps: true,
      tableName: "Projects",
      hooks: {
        beforeCreate: (project) => {
          if (!project.Table && !project.type && !project.projectType) {
            project.Table = "General"
          }
        },
      },
    },
  )

  // Define associations
  Project.associate = (models) => {
    // Project has many programs
    Project.hasMany(models.Program, {
      foreignKey: "projid",
      as: "programs",
    })
  }

  return Project
}
