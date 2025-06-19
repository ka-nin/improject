const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('residentlog', {
    residentid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    contact: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ispwd: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    issenior: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    civilstatus: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'residentlog',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "residentlog_pkey",
        unique: true,
        fields: [
          { name: "residentid" },
        ]
      },
    ]
  });
};
