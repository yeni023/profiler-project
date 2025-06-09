const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("./index");

async function createDynamicTable(tableName) {
  const DynamicModel = sequelize.define(
    tableName,
    {
      core: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      task: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      usaged: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName,
      timestamps: false,
    }
  );

  await DynamicModel.sync();
  return DynamicModel;
}

async function getTableList() {
  const [results] = await sequelize.query(
    "SELECT name FROM sqlite_master WHERE type='table'"
  );
  return results
    .map((row) => row.name)
    .filter((name) => name !== "sqlite_sequence");
}

async function dropTable(tableName) {
  await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
}

module.exports = { createDynamicTable, getTableList, dropTable };
