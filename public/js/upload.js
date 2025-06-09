import { showToast } from "./toast.js";
import { renderSelectors } from "./selectors.js";
import { chartInstance, currentStat, chartType } from "./chart.js";

const form = document.getElementById("uploadForm");
const uploadedFilesDiv = document.getElementById("uploadedFiles");
const statButtons = document.querySelectorAll(".stat-btn");
const chartButtons = document.querySelectorAll(".chart-btn");

let uploadedFiles = [];
let selectedFile = null;
let selectedCore = null;
let selectedTask = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData();
  const files = form.querySelector("input[type=file]").files;
  for (const file of files) {
    formData.append("dataFiles", file);
  }

  const res = await fetch("/upload-dynamic", {
    method: "POST",
    body: formData,
  });

  const results = await res.json();
  const newFiles = results.map((r) => r.fileName);
  uploadedFiles = Array.from(new Set([...uploadedFiles, ...newFiles]));
  selectedFile = newFiles[0];

  statButtons.forEach((b) => b.classList.remove("active"));
  chartButtons.forEach((b) => b.classList.remove("active"));
  statButtons[0].classList.add("active");
  chartButtons[0].classList.add("active");

  renderFileList();
  renderSelectors(selectedFile, selectedCore, selectedTask, setCore, setTask);
});

function setCore(core) {
  selectedCore = core;
}
function setTask(task) {
  selectedTask = task;
}

function renderFileList() {
  uploadedFilesDiv.innerHTML = "";
  uploadedFiles.forEach((file) => {
    const div = document.createElement("div");
    div.className = "file-tag";
    if (file === selectedFile) div.classList.add("selected");

    const span = document.createElement("span");
    span.className = "file-name";
    span.textContent = file;
    div.appendChild(span);

    const del = document.createElement("button");
    del.textContent = "×";
    del.title = "삭제";
    del.onclick = async (e) => {
      e.stopPropagation();
      await fetch(`/upload-dynamic/tables/${file}`, { method: "DELETE" });
      showToast(`${file} 삭제됨`);
      uploadedFiles = uploadedFiles.filter((f) => f !== file);
      if (selectedFile === file) selectedFile = uploadedFiles[0] || null;
      renderFileList();
      if (selectedFile)
        renderSelectors(
          selectedFile,
          selectedCore,
          selectedTask,
          setCore,
          setTask
        );
    };

    div.onclick = () => {
      selectedFile = file;
      renderFileList();
      renderSelectors(
        selectedFile,
        selectedCore,
        selectedTask,
        setCore,
        setTask
      );
    };

    div.appendChild(del);
    uploadedFilesDiv.appendChild(div);
  });
}

statButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    statButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentStat = btn.dataset.stat;
    renderSelectors(selectedFile, selectedCore, selectedTask, setCore, setTask);
  });
});

chartButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    chartButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    chartType = btn.dataset.type;
    renderSelectors(selectedFile, selectedCore, selectedTask, setCore, setTask);
  });
});
