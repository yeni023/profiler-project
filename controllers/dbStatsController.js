const { fn, col } = require("sequelize");
const Record = require("../models/Record");

async function getTaskStatsFromDB() {
  const result = await Record.findAll({
    attributes: [
      "task",
      [fn("AVG", col("value")), "avg"],
      [fn("MIN", col("value")), "min"],
      [fn("MAX", col("value")), "max"],
    ],
    group: ["task"],
    raw: true,
  });

  const formatted = {};
  for (const row of result) {
    formatted[row.task] = {
      avg: Number(parseFloat(row.avg).toFixed(2)),
      min: Number(row.min),
      max: Number(row.max),
    };
  }

  return formatted;
}

async function getCoreStatsFromDB() {
  const result = await Record.findAll({
    attributes: ["core", "task", [fn("AVG", col("value")), "avg"]],
    group: ["core", "task"],
    raw: true,
  });

  const formatted = {};
  for (const row of result) {
    if (!formatted[row.core]) {
      formatted[row.core] = {};
    }
    formatted[row.core][row.task] = Number(parseFloat(row.avg).toFixed(2));
  }

  return formatted;
}

module.exports = {
  getTaskStatsFromDB,
  getCoreStatsFromDB,
};
