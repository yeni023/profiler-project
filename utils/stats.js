function calculateStats(numbers) {
  if (!numbers || numbers.length === 0) return null;

  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const avg = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;

  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  const variance =
    numbers.reduce((sum, n) => sum + Math.pow(n - avg, 2), 0) / numbers.length;
  const stdDev = Math.sqrt(variance);

  return {
    min,
    max,
    avg: Number(avg.toFixed(2)),
    median: Number(median.toFixed(2)),
    stdDev: Number(stdDev.toFixed(2)),
  };
}

module.exports = { calculateStats };
