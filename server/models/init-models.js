var DataTypes = require("sequelize").DataTypes;
var _programs = require("./programs");
var _project = require("./project");
var _residentlog = require("./residentlog");

function initModels(sequelize) {
  var programs = _programs(sequelize, DataTypes);
  var project = _project(sequelize, DataTypes);
  var residentlog = _residentlog(sequelize, DataTypes);

  programs.belongsTo(programs, { as: "proj", foreignKey: "projid"});
  programs.hasMany(programs, { as: "programs", foreignKey: "projid"});

  return {
    programs,
    project,
    residentlog,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
