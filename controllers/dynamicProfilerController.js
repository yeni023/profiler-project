const fs = require("fs");
const { createDynamicTable } = require("../models/dynamic");

async function processDynamicFile(filePath, tableName) {
  const Model = await createDynamicTable(tableName);
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/);

  const rows = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.startsWith("core")) continue;

    const parts = trimmed.split(/\s+/);
    const core = parts[0];
    const values = parts.slice(1).map(Number);

    if (values.some((v) => isNaN(v))) continue;

    values.forEach((val, idx) => {
      const task = `task${idx + 1}`;
      rows.push({ core, task, usaged: val });
    });
  }

  if (rows.length === 0) {
    return {
      message: "유효한 데이터 없음",
      fileName: tableName,
    };
  }

  await Model.bulkCreate(rows);

  return {
    message: `${tableName} 테이블 생성 완료 (${rows.length}건)`,
    fileName: tableName,
  };
}

module.exports = {
  processDynamicFile,
};
