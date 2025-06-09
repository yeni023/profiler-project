const { createDynamicTable } = require("../models/dynamic");

async function getSelectors(req, res) {
  const { filename } = req.params;

  try {
    const Model = await createDynamicTable(filename);
    const records = await Model.findAll({ attributes: ["core", "task"] });

    const cores = new Set();
    const tasks = new Set();

    for (const r of records) {
      const { core, task } = r.get({ plain: true });
      cores.add(core);
      tasks.add(task);
    }

    res.json({
      cores: Array.from(cores),
      tasks: Array.from(tasks),
    });
  } catch (err) {
    res.status(500).json({ error: "Selector 데이터 조회 실패" });
  }
}

module.exports = { getSelectors };
