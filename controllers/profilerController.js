const fs = require("fs");
const readline = require("readline");
const { calculateStats } = require("../utils/stats");

const Record = require("../models/Record");

async function processFile(filePath) {
  const stream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  const result = {};

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const parts = trimmed.split(/\s+/);
    if (!parts[0].startsWith("core")) continue;

    const values = parts
      .slice(1)
      .map((val) => Number(val))
      .filter((val) => !isNaN(val));

    for (let idx = 0; idx < values.length; idx++) {
      const taskKey = `task${idx + 1}`;
      const val = values[idx];

      if (!result[taskKey]) result[taskKey] = [];
      result[taskKey].push(val);

      await Record.create({
        core: parts[0],
        task: taskKey,
        value: val,
      });
    }
  }

  const stats = {};
  for (const task in result) {
    stats[task] = calculateStats(result[task]);
  }

  return stats;
}

module.exports = { processFile };
