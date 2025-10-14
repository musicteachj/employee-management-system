<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  type ChartConfiguration,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface JobLevelData {
  level: string;
  count: number;
  percentage: number;
}

const props = defineProps<{
  jobLevelData: JobLevelData[];
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: ChartJS | null = null;

const css = getComputedStyle(document.documentElement);
const primary = css.getPropertyValue("--color-primary").trim() || "#00897b";
const success = css.getPropertyValue("--color-success").trim() || "#4caf50";
const info = css.getPropertyValue("--color-info").trim() || "#1565c0";

const levelColors: Record<string, string> = {
  Entry: success,
  Mid: info,
  Senior: "#ffb74d",
  Lead: "#5e35b1",
  Manager: "#ef5350",
  Director: "#8d6e63",
  VP: "#90a4ae",
  "C-Level": "#26c6da",
};

const createChart = () => {
  if (!chartCanvas.value || props.jobLevelData.length === 0) return;

  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Define level order for consistent display
  const levelOrder = [
    "Entry",
    "Mid",
    "Senior",
    "Lead",
    "Manager",
    "Director",
    "VP",
    "C-Level",
  ];
  const sortedData = [...props.jobLevelData].sort((a, b) => {
    const aIndex = levelOrder.indexOf(a.level);
    const bIndex = levelOrder.indexOf(b.level);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  const data = {
    labels: sortedData.map((level) => level.level),
    datasets: [
      {
        label: "Employee Count",
        data: sortedData.map((level) => level.count),
        backgroundColor: sortedData.map(
          (level) => levelColors[level.level] || "#9e9e9e"
        ),
        borderColor: sortedData.map(
          (level) => (levelColors[level.level] || "#9e9e9e") + "80"
        ),
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const config: ChartConfiguration<"bar"> = {
    type: "bar",
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y", // Horizontal bar chart
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: primary,
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (context) => {
              const value = context.parsed.x;
              const levelData = sortedData[context.dataIndex];
              return [
                `Count: ${value} employees`,
                `Percentage: ${levelData.percentage}%`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            font: {
              size: 11,
            },
            stepSize: 1,
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
              weight: 500,
            },
          },
        },
      },
      animation: {
        duration: 1000,
        easing: "easeInOutQuart",
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  };

  chartInstance = new ChartJS(ctx, config);
};

// Watch for data changes
watch(
  () => props.jobLevelData,
  () => {
    nextTick(() => {
      createChart();
    });
  },
  { deep: true }
);

onMounted(() => {
  nextTick(() => {
    createChart();
  });
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
}

canvas {
  max-height: 100%;
  max-width: 100%;
}
</style>
