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
  Title,
  Tooltip,
  Legend,
  type ChartConfiguration,
} from "chart.js";
import { jobLevelRank } from "../../constants/hierarchy";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

// Ordinal seniority scale: cool neutrals → indigo → gold at the top
const levelColors: Record<string, string> = {
  Entry: "#94A3B8",
  Mid: info, // info blue
  Senior: "#0891B2", // cyan
  Lead: success, // green
  Manager: primary, // indigo
  Director: "#6366F1",
  VP: "#818CF8", // soft violet
  "C-Level": "#A16207", // deep gold
  CEO: "#EAB308", // gold (top)
};

const createChart = () => {
  if (!chartCanvas.value || props.jobLevelData.length === 0) return;

  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Order by canonical seniority (Entry -> CEO) from the shared hierarchy.
  const sortedData = [...props.jobLevelData].sort(
    (a, b) => jobLevelRank(a.level) - jobLevelRank(b.level)
  );

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
