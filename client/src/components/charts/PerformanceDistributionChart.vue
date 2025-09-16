<template>
  <div class="chart-container">
    <v-card class="pa-4" elevation="1" rounded="lg">
      <v-card-title class="text-h6 pb-2">
        Performance Rating Distribution
      </v-card-title>
      <div class="chart-wrapper" style="position: relative; height: 300px">
        <Doughnut
          :data="chartData"
          :options="chartOptions"
          :plugins="chartPlugins"
        />
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import type { PerformanceRating } from "../../types";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

interface Props {
  ratingDistribution: Record<PerformanceRating, number>;
}

const props = defineProps<Props>();

const chartData = computed(() => {
  const labels = Object.keys(props.ratingDistribution) as PerformanceRating[];
  const data = Object.values(props.ratingDistribution);

  return {
    labels: labels.filter((_, index) => data[index] > 0), // Only show labels with data
    datasets: [
      {
        label: "Employees",
        data: data.filter((value) => value > 0), // Only show data points > 0
        backgroundColor: [
          "#4CAF50", // Exceeds Expectations - Green
          "#2196F3", // Meets Expectations - Blue
          "#FF9800", // Needs Improvement - Orange
          "#F44336", // Unsatisfactory - Red
          "#9E9E9E", // Unrated - Gray
        ].slice(0, data.filter((value) => value > 0).length),
        borderColor: [
          "#388E3C",
          "#1976D2",
          "#F57C00",
          "#D32F2F",
          "#616161",
        ].slice(0, data.filter((value) => value > 0).length),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || "";
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce(
            (a: number, b: number) => a + b,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} employees (${percentage}%)`;
        },
      },
    },
  },
  cutout: "60%", // Creates the doughnut hole
}));

const chartPlugins = computed(() => [
  {
    id: "centerText",
    beforeDraw: (chart: any) => {
      const { ctx, width, height } = chart;
      const total = chart.data.datasets[0].data.reduce(
        (a: number, b: number) => a + b,
        0
      );

      ctx.restore();
      const fontSize = Math.min(width, height) / 12;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#666";

      const text = `${total}`;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2 - fontSize / 2;

      ctx.fillText(text, textX, textY);

      // Add "Total" label
      ctx.font = `${fontSize * 0.6}px Arial`;
      const labelText = "Total";
      const labelX = Math.round((width - ctx.measureText(labelText).width) / 2);
      const labelY = height / 2 + fontSize / 2;

      ctx.fillText(labelText, labelX, labelY);
      ctx.save();
    },
  },
]);
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
