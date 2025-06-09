import { showToast } from "./toast.js";

export let chartInstance = null;
export let currentStat = "avg";
export let chartType = "bar";

export async function updateChart(
  chartCanvas,
  selectedFile,
  selectedCore,
  selectedTask
) {
  if (!selectedFile || (!selectedCore && !selectedTask)) return;

  const coreParam = selectedCore ? `core=${selectedCore}` : "";
  const taskParam = selectedTask ? `task=${selectedTask}` : "";
  const connector = coreParam && taskParam ? "&" : "";
  const query = `${coreParam}${connector}${taskParam}`;

  const res = await fetch(
    `/upload-dynamic/chart-data/${selectedFile}?${query}`
  );
  const chartData = await res.json();

  const labels = chartData.map((item) => item.label);
  const data = chartData.map((item) => item[currentStat]);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(chartCanvas, {
    type: chartType,
    data: {
      labels,
      datasets: [
        {
          label: `${selectedFile} (${currentStat})`,
          data,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}
