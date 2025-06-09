const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Record = sequelize.define("Record", {
  core: DataTypes.STRING,
  task: DataTypes.STRING,
  value: DataTypes.INTEGER,
});

module.exports = Record;
