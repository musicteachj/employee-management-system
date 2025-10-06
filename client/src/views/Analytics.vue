<template>
  <div class="analytics">
    <!-- Header Section -->
    <v-card class="pa-4 ma-2 mb-4 header-card" elevation="3" rounded="lg">
      <v-card-title class="pa-0 mb-2">
        <h5 class="text-h5 text-primary font-weight-bold">
          Employee Analytics Dashboard
        </h5>
      </v-card-title>
      <v-card-subtitle class="pa-0">
        <p class="text-body-2 text-medium-emphasis">
          Comprehensive employee data analytics and insights
        </p>
      </v-card-subtitle>
      <v-divider class="mt-4" />
    </v-card>

    <!-- Loading State -->
    <div v-if="loading" class="text-center pa-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4 text-body-1">Loading analytics data...</p>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Summary Cards -->
      <v-row class="ma-n1">
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 summary-card"
            elevation="3"
            rounded="lg"
            color="primary"
            variant="tonal"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-account-group" size="40" class="mr-3"></v-icon>
              <div>
                <h3 class="text-h3">{{ analytics.totalEmployees }}</h3>
                <p class="text-body-2">Total Employees</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 summary-card"
            elevation="3"
            rounded="lg"
            color="success"
            variant="tonal"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-account-plus" size="40" class="mr-3"></v-icon>
              <div>
                <h3 class="text-h3">{{ analytics.activeEmployees }}</h3>
                <p class="text-body-2">Active Employees</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 summary-card"
            elevation="3"
            rounded="lg"
            color="info"
            variant="tonal"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-domain" size="40" class="mr-3"></v-icon>
              <div>
                <h3 class="text-h3">{{ analytics.totalDepartments }}</h3>
                <p class="text-body-2">Departments</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 summary-card"
            elevation="3"
            rounded="lg"
            color="warning"
            variant="tonal"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-currency-usd" size="40" class="mr-3"></v-icon>
              <div>
                <h3 class="text-h3">
                  {{ Math.round(analytics.averageSalary).toLocaleString() }}
                </h3>
                <p class="text-body-2">Average Salary</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Section Row 1 -->
      <v-row class="ma-n1">
        <v-col cols="12" md="6">
          <v-card class="pa-4 chart-card" elevation="3" rounded="lg">
            <v-card-title class="pa-0 mb-3">
              <h6 class="text-h6 text-primary font-weight-bold">
                Department Distribution
              </h6>
            </v-card-title>
            <div class="chart-container" style="height: 300px">
              <DepartmentDistributionChart
                :department-data="analytics.departmentDistribution"
              />
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="pa-4 chart-card" elevation="3" rounded="lg">
            <v-card-title class="pa-0 mb-3">
              <h6 class="text-h6 text-primary font-weight-bold">
                Employment Status
              </h6>
            </v-card-title>
            <div class="chart-container" style="height: 300px">
              <EmploymentStatusChart
                :status-data="analytics.statusDistribution"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Section Row 2 -->
      <v-row class="ma-n1">
        <v-col cols="12" md="6">
          <v-card class="pa-4 chart-card" elevation="3" rounded="lg">
            <v-card-title class="pa-0 mb-3">
              <h6 class="text-h6 text-primary font-weight-bold">
                Salary Distribution by Department
              </h6>
            </v-card-title>
            <div class="chart-container" style="height: 300px">
              <SalaryDistributionChart
                :salary-data="analytics.salaryByDepartment"
              />
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="pa-4 chart-card" elevation="3" rounded="lg">
            <v-card-title class="pa-0 mb-3">
              <h6 class="text-h6 text-primary font-weight-bold">
                Job Level Distribution
              </h6>
            </v-card-title>
            <div class="chart-container" style="height: 300px">
              <JobLevelChart :job-level-data="analytics.jobLevelDistribution" />
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Section Row 3 -->
      <v-row class="ma-n1">
        <v-col cols="12">
          <v-card class="pa-4 chart-card" elevation="3" rounded="lg">
            <v-card-title class="pa-0 mb-3">
              <h6 class="text-h6 text-primary font-weight-bold">
                Hiring Trends (Last 12 Months)
              </h6>
            </v-card-title>
            <div class="chart-container" style="height: 400px">
              <HiringTrendsChart :hiring-data="analytics.hiringTrends" />
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Additional Analytics Cards -->
      <v-row class="ma-n1">
        <v-col cols="12" md="4">
          <v-card class="pa-4 info-card" elevation="3" rounded="lg">
            <v-card-title class="pa-0 mb-3">
              <h6 class="text-h6 text-primary font-weight-bold">
                Recent Hires (30 Days)
              </h6>
            </v-card-title>
            <v-list density="compact">
              <v-list-item
                v-for="hire in analytics.recentHires.slice(0, 5)"
                :key="hire.id"
                class="px-0"
              >
                <v-list-item-title class="text-body-2">
                  {{ hire.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ hire.department }} • {{ hire.hireDate }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item
                v-if="analytics.recentHires.length === 0"
                class="px-0"
              >
                <v-list-item-title class="text-body-2 text-medium-emphasis">
                  No recent hires
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-4 info-card" elevation="3" rounded="lg">
            <v-card-title class="pa-0 mb-3">
              <h6 class="text-h6 text-primary font-weight-bold">
                Top Departments by Size
              </h6>
            </v-card-title>
            <v-list density="compact">
              <v-list-item
                v-for="dept in analytics.topDepartments"
                :key="dept.name"
                class="px-0"
              >
                <v-list-item-title class="text-body-2">
                  {{ dept.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ dept.count }} employees
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-4 info-card" elevation="3" rounded="lg">
            <v-card-title class="pa-0 mb-3">
              <h6 class="text-h6 text-primary font-weight-bold">
                Employment Types
              </h6>
            </v-card-title>
            <v-list density="compact">
              <v-list-item
                v-for="type in analytics.employmentTypes"
                :key="type.type"
                class="px-0"
              >
                <v-list-item-title class="text-body-2">
                  {{ type.type }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ type.count }} employees ({{ type.percentage }}%)
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import DepartmentDistributionChart from "../components/charts/DepartmentDistributionChart.vue";
import EmploymentStatusChart from "../components/charts/EmploymentStatusChart.vue";
import SalaryDistributionChart from "../components/charts/SalaryDistributionChart.vue";
import JobLevelChart from "../components/charts/JobLevelChart.vue";
import HiringTrendsChart from "../components/charts/HiringTrendsChart.vue";

// Reactive data
const loading = ref(true);

interface AnalyticsData {
  totalEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  averageSalary: number;
  departmentDistribution: { name: string; count: number; percentage: number }[];
  statusDistribution: { status: string; count: number; percentage: number }[];
  salaryByDepartment: {
    department: string;
    averageSalary: number;
    count: number;
  }[];
  jobLevelDistribution: { level: string; count: number; percentage: number }[];
  hiringTrends: { month: string; hires: number }[];
  recentHires: {
    id: string;
    name: string;
    department: string;
    hireDate: string;
  }[];
  topDepartments: { name: string; count: number }[];
  employmentTypes: { type: string; count: number; percentage: number }[];
}

const analytics = ref<AnalyticsData>({
  totalEmployees: 0,
  activeEmployees: 0,
  totalDepartments: 0,
  averageSalary: 0,
  departmentDistribution: [],
  statusDistribution: [],
  salaryByDepartment: [],
  jobLevelDistribution: [],
  hiringTrends: [],
  recentHires: [],
  topDepartments: [],
  employmentTypes: [],
});

// Methods
const loadAnalyticsData = async () => {
  try {
    loading.value = true;

    // Fetch analytics from API
    const response = await fetch("/api/analytics/dashboard");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    analytics.value = data;
  } catch (error) {
    console.error("Error loading analytics data:", error);
    // Keep default empty values if API fails
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadAnalyticsData();
});
</script>

<style scoped>
/* Component-specific styles only - common styles are in global CSS */
</style>
