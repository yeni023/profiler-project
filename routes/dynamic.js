const express = require("express");
const router = express.Router();
const { getSelectors } = require("../controllers/dynamicSelectorController");

router.get("/selectors/:filename", getSelectors);

module.exports = router;
