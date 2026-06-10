<template>
  <div class="chart-container">
    <v-card class="chart-card" flat>
      <div class="card-head">
        <v-icon size="20">mdi-chart-line</v-icon>
        Performance Trends Over Time
      </div>
      <div class="chart-wrapper" style="position: relative; height: 300px">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

interface PerformanceTrend {
  period: string;
  averageRating: number;
  reviewCount: number;
}

interface Props {
  performanceTrends: PerformanceTrend[];
}

const props = defineProps<Props>();

const css = getComputedStyle(document.documentElement);
const info = css.getPropertyValue("--color-info").trim() || "#1565c0";
const success = css.getPropertyValue("--color-success").trim() || "#4caf50";
const primary = css.getPropertyValue("--color-primary").trim() || "#00897b";

const chartData = computed(() => ({
  labels: props.performanceTrends.map((trend) => trend.period),
  datasets: [
    {
      label: "Average Rating",
      data: props.performanceTrends.map((trend) => trend.averageRating),
      borderColor: info,
      backgroundColor: `${info}1A`,
      borderWidth: 3,
      pointBackgroundColor: info,
      pointBorderColor: primary,
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      fill: true,
      tension: 0.4,
      yAxisID: "y",
    },
    {
      label: "Review Count",
      data: props.performanceTrends.map((trend) => trend.reviewCount),
      borderColor: success,
      backgroundColor: `${success}1A`,
      borderWidth: 3,
      pointBackgroundColor: success,
      pointBorderColor: primary,
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      fill: true,
      tension: 0.4,
      yAxisID: "y1",
    },
  ],
}));

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
      borderColor: primary,
      borderWidth: 1,
      callbacks: {
        label: (context: any) => {
          const label = context.dataset.label || "";
          const value = context.parsed.y;
          if (label === "Average Rating") {
            return `${label}: ${value.toFixed(2)}/5.0`;
          }
          return `${label}: ${value} reviews`;
        },
      },
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: "Time Period",
        font: {
          size: 14,
          weight: "bold" as const,
        },
      },
      grid: {
        display: false,
      },
    },
    y: {
      type: "linear" as const,
      display: true,
      position: "left" as const,
      title: {
        display: true,
        text: "Average Rating",
        color: info,
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
        text: "Review Count",
        color: success,
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
        stepSize: 5,
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
  padding: 16px;
}
</style>
