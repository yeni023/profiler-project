const { createDynamicTable } = require("../models/dynamic");

async function getChartData(tableName, core, task) {
  const Model = await createDynamicTable(tableName);

  let records;

  if (core) {
    records = await Model.findAll({
      where: { core },
      attributes: ["core", "task", "usaged"],
    });
    return aggregateStats(records, "task");
  }

  if (task) {
    records = await Model.findAll({
      where: { task },
      attributes: ["core", "task", "usaged"],
    });
    return aggregateStats(records, "core");
  }

  throw new Error("core 또는 task 설정이 필요합니다.");
}

function aggregateStats(records, labelKey) {
  const groups = {};

  for (const record of records) {
    const r = record.get({ plain: true });
    const key = r[labelKey];
    if (!groups[key]) groups[key] = [];
    groups[key].push(r.usaged);
  }

  const result = Object.entries(groups).map(([label, values]) => {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(values.length / 2)];
    const stdDev = Math.sqrt(
      values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length
    );
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      label,
      avg: Math.round(avg),
      median: Math.round(median),
      stdDev: Math.round(stdDev),
      min,
      max,
    };
  });

  return result;
}

async function getCoreTaskSelectors(tableName) {
  const Model = await createDynamicTable(tableName);
  const records = await Model.findAll({ attributes: ["core", "task"] });

  const cores = new Set();
  const tasks = new Set();

  for (const r of records) {
    const { core, task } = r.get({ plain: true });
    if (core) cores.add(core);
    if (task) tasks.add(task);
  }

  return {
    cores: Array.from(cores),
    tasks: Array.from(tasks),
  };
}

module.exports = {
  getChartData,
  getCoreTaskSelectors,
};
