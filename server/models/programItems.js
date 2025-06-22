module.exports = (sequelize, DataTypes) => {
  const ProgramItems = sequelize.define(
    "ProgramItems",
    {
      itemid: {
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
      itemName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "Name of the item (e.g., 'Rice', 'Medicine', 'School Supplies')",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      unit: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "pcs",
        comment: "Unit of measurement (e.g., 'kg', 'pcs', 'boxes', 'liters')",
      },
      quantityDistributed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      quantityRemaining: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      unitCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: "Cost per unit",
      },
      totalCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: "Total cost for all quantity",
      },
      supplier: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      expirationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("Available", "Low Stock", "Out of Stock", "Expired"),
        allowNull: false,
        defaultValue: "Available",
      },
    },
    {
      timestamps: true,
      tableName: "ProgramItems",
      hooks: {
        beforeSave: (item) => {
          // Calculate remaining quantity
          item.quantityRemaining = item.quantity - item.quantityDistributed

          // Calculate total cost
          if (item.unitCost && item.quantity) {
            item.totalCost = item.unitCost * item.quantity
          }

          // Update status based on remaining quantity
          if (item.quantityRemaining <= 0) {
            item.status = "Out of Stock"
          } else if (item.quantityRemaining <= item.quantity * 0.1) {
            // 10% threshold
            item.status = "Low Stock"
          } else {
            item.status = "Available"
          }
        },
      },
    },
  )

  ProgramItems.associate = (models) => {
    ProgramItems.belongsTo(models.Program, {
      foreignKey: "programid",
      as: "program",
    })
  }

  return ProgramItems
}
