const express = require("express");
const path = require("path");
const uploadRouter = require("./routes/upload");
const uploadDynamicRouter = require("./routes/upload-dynamic");
const dynamicRouter = require("./routes/dynamic");
const { sequelize } = require("./models");

const app = express();
const PORT = 3000;

sequelize.sync().then(() => {
  console.log("DB synced");
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/upload", uploadRouter);
app.use("/upload-dynamic", uploadDynamicRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
