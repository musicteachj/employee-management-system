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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalaryData {
  department: string;
  averageSalary: number;
  count: number;
}

const props = defineProps<{
  salaryData: SalaryData[];
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: ChartJS | null = null;

const createChart = () => {
  if (!chartCanvas.value || props.salaryData.length === 0) return;

  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Sort data by average salary for better visualization
  const sortedData = [...props.salaryData].sort(
    (a, b) => b.averageSalary - a.averageSalary
  );

  const data = {
    labels: sortedData.map((dept) => dept.department),
    datasets: [
      {
        label: "Average Salary",
        data: sortedData.map((dept) => dept.averageSalary),
        backgroundColor: "rgba(25, 118, 210, 0.7)",
        borderColor: "#1976d2",
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
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "#1976d2",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (context) => {
              const value = context.parsed.y;
              const deptData = sortedData[context.dataIndex];
              return [
                `Average Salary: $${value.toLocaleString()}`,
                `Employees: ${deptData.count}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
              weight: "500",
            },
            maxRotation: 45,
            minRotation: 0,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            font: {
              size: 11,
            },
            callback: function (value) {
              return "$" + (value as number).toLocaleString();
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
  () => props.salaryData,
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
