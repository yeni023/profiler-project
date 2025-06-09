const express = require("express");
const multer = require("multer");
const path = require("path");
const { processFile } = require("../controllers/profilerController");
const {
  getTaskStatsFromDB,
  getCoreStatsFromDB,
} = require("../controllers/dbStatsController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `uploaded-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("dataFile"), async (req, res) => {
  try {
    const result = await processFile(req.file.path);
    res.json(result);
  } catch (err) {
    res.status(500).send("파일 처리 중 오류 발생");
  }
});

router.get("/db-stats", async (req, res) => {
  const stats = await getTaskStatsFromDB();
  res.json(stats);
});

router.get("/core-stats", async (req, res) => {
  const stats = await getCoreStatsFromDB();
  res.json(stats);
});

module.exports = router;
