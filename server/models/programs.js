const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('programs', {
    programid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    projid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'programs',
        key: 'programid'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    datestart: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    completiondate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'programs',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "programs_pkey",
        unique: true,
        fields: [
          { name: "programid" },
        ]
      },
    ]
  });
};
