<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartConfiguration,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DepartmentData {
  name: string;
  count: number;
  percentage: number;
}

const props = defineProps<{
  departmentData: DepartmentData[];
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: ChartJS | null = null;

// Teal-aligned categorical palette
const colors = [
  getComputedStyle(document.documentElement)
    .getPropertyValue("--color-primary")
    .trim() || "#00897b",
  "#26c6da", // accent cyan
  "#4caf50", // success green
  "#ffb74d", // soft orange
  "#5e35b1", // indigo/purple accent
  "#009688", // teal variant
  "#90a4ae", // blue-grey
  "#8d6e63", // brown
  "#42a5f5", // light blue for contrast
  "#ef5350", // soft red
];

const createChart = () => {
  if (!chartCanvas.value || props.departmentData.length === 0) return;

  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  const data = {
    labels: props.departmentData.map((dept) => dept.name),
    datasets: [
      {
        data: props.departmentData.map((dept) => dept.count),
        backgroundColor: colors.slice(0, props.departmentData.length),
        borderColor: colors
          .slice(0, props.departmentData.length)
          .map((color) => `${color}80`),
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 4,
      },
    ],
  };

  const css = getComputedStyle(document.documentElement);
  const primary = css.getPropertyValue("--color-primary").trim() || "#00897b";

  const config: ChartConfiguration<"doughnut"> = {
    type: "doughnut",
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
            font: {
              size: 12,
              weight: "500",
            },
            generateLabels: (chart) => {
              const data = chart.data;
              if (data.labels && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const dataset = data.datasets[0];
                  const value = dataset.data[i] as number;
                  const percentage = props.departmentData[i]?.percentage || 0;
                  return {
                    text: `${label} (${value} - ${percentage}%)`,
                    fillStyle: dataset.backgroundColor?.[i] as string,
                    strokeStyle: dataset.borderColor?.[i] as string,
                    lineWidth: 2,
                    hidden: false,
                    index: i,
                  };
                });
              }
              return [];
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: primary,
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: (context) => {
              const label = context.label || "";
              const value = context.parsed;
              const percentage =
                props.departmentData[context.dataIndex]?.percentage || 0;
              return `${label}: ${value} employees (${percentage}%)`;
            },
          },
        },
      },
      cutout: "60%",
      animation: {
        animateRotate: true,
        animateScale: true,
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
  () => props.departmentData,
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
