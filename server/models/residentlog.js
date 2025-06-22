module.exports = (sequelize, DataTypes) => {
  const ResidentLog = sequelize.define(
    "ResidentLog",
    {
      residentid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 150,
        },
      },
      contact: {
        type: DataTypes.STRING(12),
        allowNull: true,
        validate: {
          len: [10, 12], // Phone number validation
        },
      },
      ispwd: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Person with Disability status",
      },
      issenior: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Senior Citizen status",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Active status of the resident",
      },
      civilstatus: {
        type: DataTypes.ENUM("Single", "Married", "Divorced", "Widowed", "Separated"),
        allowNull: true,
        defaultValue: "Single",
      },
      // Additional fields for better tracking
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("Male", "Female", "Other"),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "ResidentLog",
      hooks: {
        beforeCreate: (resident) => {
          // Auto-set senior status based on age
          if (resident.age && resident.age >= 60) {
            resident.issenior = true
          }
        },
        beforeUpdate: (resident) => {
          // Auto-update senior status if age changes
          if (resident.age && resident.age >= 60) {
            resident.issenior = true
          } else if (resident.age && resident.age < 60) {
            resident.issenior = false
          }
        },
      },
    },
  )

  // Define associations
  ResidentLog.associate = (models) => {
    // Resident has many program beneficiaries
    ResidentLog.hasMany(models.ProgramBeneficiaries, {
      foreignKey: "residentid",
      as: "programBenefits",
    })

  }

  return ResidentLog
}
