import { updateChart } from "./chart.js";

export async function renderSelectors(
  fileName,
  selectedCore,
  selectedTask,
  setCore,
  setTask
) {
  const res = await fetch(`/upload-dynamic/selectors/${fileName}`);
  const { cores, tasks } = await res.json();

  const coreDiv = document.getElementById("coreSelector");
  const taskDiv = document.getElementById("taskSelector");
  coreDiv.innerHTML = "";
  taskDiv.innerHTML = "";

  cores.forEach((core) => {
    const btn = document.createElement("button");
    btn.textContent = core;
    if (core === selectedCore) btn.classList.add("active");
    btn.onclick = () => {
      setCore(core);
      setTask(null);
      renderSelectors(fileName, core, null, setCore, setTask);
    };
    coreDiv.appendChild(btn);
  });

  tasks.forEach((task) => {
    const btn = document.createElement("button");
    btn.textContent = task;
    if (task === selectedTask) btn.classList.add("active");
    btn.onclick = () => {
      setTask(task);
      setCore(null);
      renderSelectors(fileName, null, task, setCore, setTask);
    };
    taskDiv.appendChild(btn);
  });

  updateChart(
    document.getElementById("taskChart"),
    fileName,
    selectedCore,
    selectedTask
  );
}
