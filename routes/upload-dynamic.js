const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  processDynamicFile,
} = require("../controllers/dynamicProfilerController");
const { getTableList, dropTable } = require("../models/dynamic");
const {
  getCoreTaskSelectors,
  getChartData,
} = require("../controllers/dynamicChartController");

const router = express.Router();

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

function sanitizeTableName(rawName) {
  return rawName.replace(/[^a-zA-Z0-9_]/g, "_");
}

router.post("/", upload.array("dataFiles"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
  }

  try {
    const results = [];

    for (const file of req.files) {
      const rawTableName = path.parse(file.originalname).name;
      const tableName = sanitizeTableName(rawTableName);

      const result = await processDynamicFile(file.path, tableName);
      results.push({ ...result, fileName: tableName });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "파일 처리 중 오류 발생" });
  }
});

router.get("/tables", async (req, res) => {
  try {
    const list = await getTableList();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "테이블 목록 조회 실패" });
  }
});

router.delete("/tables/:name", async (req, res) => {
  const tableName = sanitizeTableName(req.params.name);

  try {
    await dropTable(tableName);
    res.json({ message: `${tableName} 테이블 삭제 완료` });
  } catch (err) {
    res.status(500).json({ error: "테이블 삭제 실패" });
  }
});

router.get("/selectors/:tableName", async (req, res) => {
  try {
    const selectors = await getCoreTaskSelectors(req.params.tableName);
    res.json(selectors);
  } catch (err) {
    res.status(500).json({ error: "Selector 데이터 조회 실패" });
  }
});

router.get("/chart-data/:tableName", async (req, res) => {
  const tableName = sanitizeTableName(req.params.tableName);
  const { core, task } = req.query;

  try {
    const data = await getChartData(tableName, core, task);
    // console.log("📈 반환될 데이터:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ 차트 데이터 오류:", err);
    res.status(500).json({ error: "차트 데이터 조회 실패" });
  }
});

module.exports = router;
