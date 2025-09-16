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

interface StatusData {
  status: string;
  count: number;
  percentage: number;
}

const props = defineProps<{
  statusData: StatusData[];
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: ChartJS | null = null;

const statusColors: Record<string, string> = {
  Active: "#4caf50",
  Inactive: "#ff9800",
  Terminated: "#f44336",
  "On Leave": "#2196f3",
  Probation: "#9c27b0",
};

const createChart = () => {
  if (!chartCanvas.value || props.statusData.length === 0) return;

  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  const data = {
    labels: props.statusData.map((status) => status.status),
    datasets: [
      {
        data: props.statusData.map((status) => status.count),
        backgroundColor: props.statusData.map(
          (status) => statusColors[status.status] || "#9e9e9e"
        ),
        borderColor: props.statusData.map(
          (status) => (statusColors[status.status] || "#9e9e9e") + "80"
        ),
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 4,
      },
    ],
  };

  const config: ChartConfiguration<"pie"> = {
    type: "pie",
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 15,
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
                  const percentage = props.statusData[i]?.percentage || 0;
                  return {
                    text: `${label} (${percentage}%)`,
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
          borderColor: "#1976d2",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: (context) => {
              const label = context.label || "";
              const value = context.parsed;
              const percentage =
                props.statusData[context.dataIndex]?.percentage || 0;
              return `${label}: ${value} employees (${percentage}%)`;
            },
          },
        },
      },
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
  () => props.statusData,
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
