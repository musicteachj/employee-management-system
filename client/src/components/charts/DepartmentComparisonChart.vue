<template>
  <div class="chart-container">
    <v-card class="pa-4" elevation="1" rounded="lg">
      <v-card-title class="text-h6 pb-2">
        Performance by Department
      </v-card-title>
      <div class="chart-wrapper" style="position: relative; height: 350px">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

interface DepartmentPerformance {
  averageRating: number;
  totalReviews: number;
  employeeCount: number;
}

interface Props {
  departmentPerformance: Record<string, DepartmentPerformance>;
}

const props = defineProps<Props>();

const chartData = computed(() => {
  const departments = Object.keys(props.departmentPerformance);
  const averageRatings = departments.map(
    (dept) => props.departmentPerformance[dept].averageRating
  );
  const employeeCounts = departments.map(
    (dept) => props.departmentPerformance[dept].employeeCount
  );

  return {
    labels: departments,
    datasets: [
      {
        label: "Average Rating",
        data: averageRatings,
        backgroundColor: "rgba(33, 150, 243, 0.7)",
        borderColor: "#2196F3",
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
        yAxisID: "y",
      },
      {
        label: "Employee Count",
        data: employeeCounts,
        backgroundColor: "rgba(76, 175, 80, 0.7)",
        borderColor: "#4CAF50",
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
        yAxisID: "y1",
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#ddd",
      borderWidth: 1,
      callbacks: {
        label: (context: any) => {
          const label = context.dataset.label || "";
          const value = context.parsed.y;
          const department = context.label;
          const deptData = props.departmentPerformance[department];

          if (label === "Average Rating") {
            return `${label}: ${value.toFixed(2)}/5.0 (${
              deptData.totalReviews
            } reviews)`;
          }
          return `${label}: ${value} employees`;
        },
      },
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: "Department",
        font: {
          size: 14,
          weight: "bold" as const,
        },
      },
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 45,
        minRotation: 0,
      },
    },
    y: {
      type: "linear" as const,
      display: true,
      position: "left" as const,
      title: {
        display: true,
        text: "Average Rating",
        color: "#2196F3",
        font: {
          size: 14,
          weight: "bold" as const,
        },
      },
      min: 0,
      max: 5,
      ticks: {
        stepSize: 1,
        callback: (value: any) => `${value}.0`,
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
    y1: {
      type: "linear" as const,
      display: true,
      position: "right" as const,
      title: {
        display: true,
        text: "Employee Count",
        color: "#4CAF50",
        font: {
          size: 14,
          weight: "bold" as const,
        },
      },
      min: 0,
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        stepSize: 1,
      },
    },
  },
}));
</script>

<style scoped>
.chart-container {
  width: 100%;
}

.chart-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
