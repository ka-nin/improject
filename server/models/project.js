module.exports = (sequelize, DataTypes) => {
  const Projects = sequelize.define(
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
      // Add the missing fields that your routes expect
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
      timestamps: true, // This adds createdAt and updatedAt
      tableName: "Projects", // Explicitly set table name
      hooks: {
        beforeCreate: (project) => {
          // Ensure at least one type field is set
          if (!project.Table && !project.type && !project.projectType) {
            project.Table = "General"
          }
        },
      },
    },
  )

  return Projects
}
